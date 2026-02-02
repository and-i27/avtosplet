// next-auth server action for GitHub login

"use server";

import { signIn } from "next-auth/react";

export async function githubLogin() {
  await signIn("github");
}
