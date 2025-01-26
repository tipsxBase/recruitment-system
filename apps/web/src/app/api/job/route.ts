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

export async function GET(req: Request) {
  const url = new URL(req.url);

  const params = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (key === "pageIndex") {
      params[key] = Number(value);
    } else if (key === "pageSize") {
      params[key] = Number(value);
    } else {
      params[key] = value;
    }
  }

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.SERVER_BASE_URL}/api/job/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  return res;
}
