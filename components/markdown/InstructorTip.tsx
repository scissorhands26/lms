import { useEffect, useState } from "react";
import { GetUser } from "./GetUser";

export default function InstructorTip({ tip }: { tip: string }) {
  const [user, setUser] = useState<any>(null);
  const [isInstructor, setIsInstructor] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await GetUser();
      setUser(currentUser);

      if (
        currentUser?.expand?.roles?.name === "instructor" ||
        currentUser?.expand?.roles?.name === "admin"
      ) {
        setIsInstructor(true);
      }
    }

    fetchUser();
  }, []);

  if (isInstructor) {
    return (
      <div
        className="mt-4 rounded-r-lg rounded-t-lg border-l-4 border-blue-700 bg-blue-950 text-blue-100"
        role="alert"
      >
        <p className="rounded-t bg-blue-700 px-2 text-lg font-bold">
          Instructor Tip
        </p>
        <p className="p-4 font-bold">{tip}</p>
      </div>
    );
  } else {
    return null;
  }
}
