import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(1, { message: "请输入用户名" }),
  password: z
    .string()
    .min(1, {
      message: "请输入密码",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export type LoginForm = z.infer<typeof formSchema>;

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
