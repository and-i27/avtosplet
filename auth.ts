/*import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: 
    [
      Credentials({
        credentials: {
          username: { label: "Username" },
          password: { label: "Password", type: "password" },
        },
        async authorize({ request }) {
          const response = await fetch(request)
          if (!response.ok) return null
          return (await response.json()) ?? null
        },
      }),GitHub 
  ],


})
*/
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
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

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    emailVerified: null, // ⬅⬅⬅ KLJUČNI DEL !!!
  };
}

    }),

    GitHub,
  ],

  session: { strategy: "jwt" },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null,  // REQUIRED by AdapterUser
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
        emailVerified: Date | null;
      };
    }

    return session;
  },

    authorized() {
      return true;
    }
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);





