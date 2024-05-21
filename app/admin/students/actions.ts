import getPb from "@/pb/getPb";

async function handleCreateStudent(formData: FormData) {
  "use server";
  const password = (formData.get("password") as string) ?? "";
  const email = (formData.get("email") as string) ?? "";
  const last_name = (formData.get("last_name") as string) ?? "";
  const first_name = (formData.get("first_name") as string) ?? "";
  const branch = (formData.get("branch") as string) ?? "";
  const mos = (formData.get("mos") as string) ?? "";
  const rank = (formData.get("rank") as string) ?? "";
  const birthdate = (formData.get("birthdate") as string) ?? "";

  const pb = await getPb();

  const data = {
    password,
    passwordConfirm: password,
    email,
    last_name,
    first_name,
    branch,
    mos,
    rank,
    birthdate,
    roles: ["k4punq9hul00961"],
  };

  const record = await pb.collection("users").create(data);
  console.log(record);
}

export { handleCreateStudent };
