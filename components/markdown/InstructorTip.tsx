import getUser from "@/pb/getUser";
import { useEffect, useState } from "react";

export default function InstructorTip() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const user: any = await getUser();
      console.log(user);
      setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <div
      className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
      role="alert"
    >
      <p className="font-bold">Instructor Tip</p>
      <p>{user?.username}</p>
    </div>
  );
}
