import { get, omit } from "@recruitment/shared";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const requestBody = await req.json();
  const requestUrl = get(requestBody, "requestUrl");
  if (!requestUrl) {
    return new Response("requestUrl is required", { status: 400 });
  }
  const json = omit(requestBody, "requestUrl");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const res = await fetch(`${process.env.SERVER_BASE_URL}${requestUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(json),
  });
  return res;
}

export async function GET() {
  return new Response("Please use POST", { status: 500 });
}
