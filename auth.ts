import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";
import { writeClient } from "@/sanity/lib/write-client";


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
    async signIn({ user, account }) {
    // Samo za GitHub
    if (account?.provider === "github") {
      if (!user.email) return false;

      // Ali user že obstaja po emailu?
      const existingUser = await client.fetch(
        `*[_type=="user" && email==$email][0]`,
        { email: user.email }
      );

      if (existingUser) {
        // 👉 LINK GITHUB NA OBSTOJEČ PROFIL
        await writeClient
          .patch(existingUser._id)
          .setIfMissing({
            providers: [],
          })
          .append("providers", ["github"])
          .set({
            githubId: account.providerAccountId,
            emailVerified: new Date().toISOString(),
          })
          .commit();
      } else {
        // 👉 USTVARI NOV USER (GitHub-only)
        await writeClient.create({
          _type: "user",
          name: user.name,
          email: user.email,
          githubId: account.providerAccountId,
          providers: ["github"],
          emailVerified: new Date().toISOString(),
        });
      }
    }

    return true;
  },
    async jwt({ token, user }) {
  if (user?.email) {
    const dbUser = await client.fetch(
      `*[_type=="user" && email==$email][0]{
        _id,
        name,
        email,
        providers,
        emailVerified
      }`,
      { email: user.email }
    );

    if (dbUser) {
      token.user = {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        providers: dbUser.providers ?? [],
        emailVerified: dbUser.emailVerified ?? null,
      };
    }
  }

  return token;
}

,

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
