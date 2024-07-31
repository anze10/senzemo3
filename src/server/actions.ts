'use server'

import { signIn, signOut } from "src/server/auth";

export async function doSocialLogin(formData: { get: (arg0: string) => any; }) {
    const action = formData.get('action');
    await signIn(action, { redirectTo: "/home" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}