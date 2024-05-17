"use server";

import { cookieParse } from "pocketbase";
import { cookies } from "next/headers";
import getPb from "./getPb";

async function login(identity: string, password: string) {
  try {
    const pb = await getPb();

    await pb.collection("users").authWithPassword(identity, password);

    // Success to login
    const cookie = pb.authStore.exportToCookie({ httpOnly: false });

    const { Path, Expires, SameSite } = cookieParse(cookie);

    cookies().set("pb_auth", cookie, {
      path: Path,
      expires: new Date(Expires),
      sameSite: SameSite,
      httpOnly: true,
      secure: true,
    });
  } catch (_) {
    // Fail to login
    console.log("Fail to login. Please check your identity and password.", _);
  }
}

export default login;
