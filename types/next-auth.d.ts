import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    providers?: string[];
    emailVerified?: Date | null;
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      providers?: string[];
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      name: string | null;
      email: string | null;
      providers?: string[];
      emailVerified?: Date | null;
    };
  }
}
