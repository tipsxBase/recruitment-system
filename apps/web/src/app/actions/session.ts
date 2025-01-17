"use server";

import { UserEntity } from "@recruitment/schema/interface";
import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.SERVER_BASE_URL}/api/user/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const user = await res.json();
  return user as UserEntity;
};
