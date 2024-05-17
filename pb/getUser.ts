"use server";

import getPb from "./getPb";

export default async function getUser() {
  const pb = await getPb();

  return pb.authStore.model;
}
