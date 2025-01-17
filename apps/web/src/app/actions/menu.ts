"use server";

import { cookies } from "next/headers";
import { RecruitmentResponse, MenuEntity } from "@recruitment/schema/interface";
export const getMenus = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const res = await fetch(`${process.env.SERVER_BASE_URL}/api/user/menus`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const menus = await res.json();

  return menus as RecruitmentResponse<MenuEntity[]>;
};
