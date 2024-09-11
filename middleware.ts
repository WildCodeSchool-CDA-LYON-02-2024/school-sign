import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export default async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("session");
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/school/:path*"],
};