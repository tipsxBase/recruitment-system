// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // 从 cookies 获取 token
  if (!token) {
    // 没有 token，跳转到登录页面
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // 如果 token 存在，可以验证其有效性
  const res = await fetch(
    `${process.env.SERVER_BASE_URL}/auth/validate-token`,
    {
      method: "POST",
      body: JSON.stringify({ token: token.value }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    // 如果 token 无效或过期，跳转到登录页面
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/interview", req.url));
  }
  // Token 有效，继续访问请求的页面
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ], // 只在这些路径下运行认证检查
};
