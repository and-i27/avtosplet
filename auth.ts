import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";
import { writeClient } from "@/sanity/lib/write-client";

function uniqueProviders(providers?: string[]) {
  return Array.from(new Set((providers ?? []).filter(Boolean)));
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
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

        if (!user.password) {
          return null;
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) return null;

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          providers: uniqueProviders(user.providers ?? ["credentials"]),
          role: user.role ?? "user",
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
      if (account?.provider === "github") {
        if (!user.email) return false;

        const existingUser = await client.fetch<{
          _id: string;
          role?: "user" | "admin";
          providers?: string[];
        } | null>(
          `*[_type=="user" && email==$email][0]{
            _id,
            role,
            providers
          }`,
          { email: user.email }
        );

        if (existingUser) {
          const nextProviders = uniqueProviders([
            ...(existingUser.providers ?? []),
            "github",
          ]);

          await writeClient
            .patch(existingUser._id)
            .set({
              githubId: account.providerAccountId,
              providers: nextProviders,
              role: existingUser.role ?? "user",
              emailVerified: new Date().toISOString(),
            })
            .commit();
        } else {
          await writeClient.create({
            _type: "user",
            name: user.name,
            email: user.email,
            githubId: account.providerAccountId,
            providers: ["github"],
            role: "user",
            emailVerified: new Date().toISOString(),
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      const email = user?.email ?? token.user?.email ?? token.email;

      if (email) {
        const dbUser = await client.fetch(
          `*[_type=="user" && email==$email][0]{
            _id,
            name,
            email,
            providers,
            role,
            emailVerified
          }`,
          { email }
        );

        if (dbUser) {
          token.user = {
            id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            providers: uniqueProviders(dbUser.providers),
            role: dbUser.role ?? "user",
            emailVerified: dbUser.emailVerified ?? null,
          };
        }
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
          role: "user" | "admin";
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
