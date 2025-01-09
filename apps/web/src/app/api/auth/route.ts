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

export const doLogin = async (params: LoginForm) => {
  console.log("/doLogin", params);
};

export async function POST(req: Request) {
  const params = await req.json();

  const res = await fetch(`${process.env.SERVER_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return res;
}
