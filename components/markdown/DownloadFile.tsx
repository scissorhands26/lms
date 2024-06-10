import PocketBase from "pocketbase";
import Cookies from "js-cookie";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export async function DownloadFile() {
  const pb_cookie: any = Cookies.get("pb_auth");

  pb.authStore.loadFromCookie(pb_cookie);

  if (!pb.authStore.model?.id) {
    return null;
  }

  const userRecord = await pb
    .collection("users")
    .getOne(pb.authStore.model?.id, {
      expand: "branch,courses,roles",
    });

  return userRecord;
}
