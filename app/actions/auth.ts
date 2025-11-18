"use server";

import { signIn } from "next-auth/react";

export async function githubLogin() {
  await signIn("github");
}
