import PocketBase from "pocketbase";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export default function InstructorTip({ tip }: { tip: string }) {
  const [user, setUser] = useState<any>(null);
  const [isInstrctor, setIsInstructor] = useState<boolean>(false);

  const pb_cookie: any = Cookies.get("pb_auth");

  pb.authStore.loadFromCookie(pb_cookie);

  console.log(pb.authStore.model);

  useEffect(() => {
    async function fetchUser() {
      if (!pb.authStore.model?.id) {
        return;
      }
      const userRecord = await pb
        .collection("users")
        .getOne(pb.authStore.model?.id, {
          expand: "branch,courses,roles",
        });
      setUser(userRecord);
      setIsInstructor(
        userRecord.expand?.roles.some((role: any) => role.name === "instructor")
      );
    }

    fetchUser();
  }, []);

  if (isInstrctor) {
    return (
      <div
        className="bg-blue-950 border-l-4 border-blue-700 text-blue-100 mt-4"
        role="alert"
      >
        <p className="font-bold bg-blue-700 px-2 text-lg">Instructor Tip</p>
        <p className="font-bold p-4">{tip}</p>
      </div>
    );
  }
}
