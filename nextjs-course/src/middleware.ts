import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  //   const pathname = request.nextUrl.pathname;

  //   // Handle root path
  // 重定向到英文版網站
  //   if (pathname === "/") {
  //     return NextResponse.redirect(new URL("/en", request.url));
  //   }

  // 檢查user是否有登入
  //   const cookieStore = await cookies();
  //   const accessToken = cookieStore.get("token")?.value;
  //   if (!accessToken) {
  //     return NextResponse.redirect(new URL(`/en/verify`, request.url));
  //   }

  return NextResponse.next();
}

// 那些路徑要使用這個middleware
export const config = {
  matcher: ["/"],
};
