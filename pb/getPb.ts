"use server";

import { cookies } from "next/headers";
import PocketBase from "pocketbase";

export default async function getPb() {
  const pb = new PocketBase("http://10.1.2.93:8090");

  if (cookies().has("pb_auth")) {
    const cookie = cookies().get("pb_auth")!.value;

    pb.authStore.loadFromCookie(cookie);

    try {
      if (pb.authStore.isValid) {
        await pb.collection("users").authRefresh({
          requestKey: null,
        });
      }
    } catch (_) {
      pb.authStore.clear();
    }
  }

  return pb;
}
