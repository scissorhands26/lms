import getPb from "@/pb/getPb";

export async function handleCreateStudent(formData: FormData) {
  "use server";
  const password = (formData.get("password") as string) ?? "";
  const email = (formData.get("email") as string) ?? "";
  const last_name = (formData.get("last_name") as string) ?? "";
  const first_name = (formData.get("first_name") as string) ?? "";
  const branch = (formData.get("branch") as string) ?? "";
  const mos = (formData.get("mos") as string) ?? "";
  const rank = (formData.get("rank") as string) ?? "";
  const birthdate = (formData.get("birthdate") as any) ?? "";

  const pb = await getPb();

  function generateUsername() {
    return rank + "_" + last_name + "_" + Math.floor(Math.random() * 1000);
  }

  function getToday() {
    const today = new Date();
    return today.toISOString();
  }

  console.log("birthdate", birthdate);
  console.log("rank", rank);

  const data = {
    username: generateUsername(),
    email,
    emailVisibility: true,
    password,
    passwordConfirm: password,
    name: first_name + " " + last_name,
    first_name,
    last_name,
    rank,
    mos,
    birthdate,
    enrolled_date: getToday(),
    courses: ["pwlhokhlenxh027"],
    roles: "k4punq9hul00961",
    last_login: "2022-01-01 10:00:00.123Z",
    branch,
  };

  try {
    const record = await pb.collection("users").create(data);
    console.log(record);
    return record;
  } catch (error) {
    console.error(error);
    return error;
  }
}
