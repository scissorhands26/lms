"use server";

import { cookieParse } from "pocketbase";
import { cookies } from "next/headers";
import getPb from "./getPb";

async function login(identity: string, password: string) {
  try {
    const pb = await getPb();

    const auth = await pb
      .collection("users")
      .authWithPassword(identity, password);

    // Success to login
    const cookie = pb.authStore.exportToCookie({ httpOnly: false });

    const { Path, Expires, SameSite } = cookieParse(cookie);

    cookies().set("pb_auth", cookie, {
      path: Path,
      expires: new Date(Expires),
      sameSite: SameSite,
      httpOnly: false,
      secure: true,
    });

    return {
      success: true,
      obj: auth,
    };
  } catch (error) {
    // Fail to login
    console.log(
      "Fail to login. Please check your identity and password.",
      error,
    );
    return {
      success: false,
      obj: error,
    };
  }
}

export default login;
