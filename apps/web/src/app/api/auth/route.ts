export async function POST(req: Request) {
  const params = await req.json();

  const res = await fetch(`${process.env.SERVER_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        ...res.headers,
        "Set-Cookie": "token=; Max-Age=0; Path=/",
      },
    });
  }

  return res;
}
