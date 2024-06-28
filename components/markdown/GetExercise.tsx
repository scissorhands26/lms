import PocketBase from "pocketbase";
import Cookies from "js-cookie";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export async function GetExercise(exerciseID: string) {
  console.log("GetExercise called with exerciseID:", exerciseID);

  const pbCookie = Cookies.get("pb_auth");
  if (pbCookie) {
    pb.authStore.loadFromCookie(pbCookie);
  }

  if (!pb.authStore.model?.id) {
    return null;
  }

  const url = `https://containers.cnmfu.local/exercises/${exerciseID}/${pb.authStore.model.id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      console.log(`Error ${response.status}: ${JSON.stringify(response)}`);
      // @ts-ignore
      throw new Error(`Error ${response.status}: ${response.detail}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch exercise:", error);
    throw error;
  }
}
