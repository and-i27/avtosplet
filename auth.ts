import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email);
        const password = String(credentials.password);

        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email }
        );

        if (!user) return null;

        // If user exists but has no password → GitHub-only account
        if (!user.password) {
          return null;
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) return null;

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          providers: user.providers ?? ["credentials"],
          emailVerified: user.emailVerified ?? null,
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      async profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          emailVerified: new Date(),
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account }) {
      // Credentials login
      if (user && !account) {
        token.user = user;
        return token;
      }

      // GitHub login
      if (account?.provider === "github" && user?.email) {
        const email = user.email;

        let existingUser = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email }
        );

        if (existingUser) {
          const providers = existingUser.providers ?? [];
          if (!providers.includes("github")) providers.push("github");

          await writeClient.patch(existingUser._id)
            .set({ githubId: String(user.id), providers })
            .commit();

          token.user = {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            providers,
            emailVerified: existingUser.emailVerified ?? null,
          };

          return token;
        }

        // Create new GitHub user
        const newUser = await writeClient.create({
          _type: "user",
          name: user.name,
          email,
          githubId: String(user.id),
          providers: ["github"],
          password: null,
          emailVerified: new Date(),
        });

        token.user = {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          providers: ["github"],
          emailVerified: newUser.emailVerified,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as {
          id: string;
          name: string;
          email: string;
          providers: string[];
          emailVerified: Date | null;
        };
      }
      return session;
    },

    authorized() {
      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
