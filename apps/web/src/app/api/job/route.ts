import { cookies } from "next/headers";

export async function POST(req: Request) {
  const json = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const res = await fetch(`${process.env.SERVER_BASE_URL}/api/job/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(json),
  });
  return res;
}
