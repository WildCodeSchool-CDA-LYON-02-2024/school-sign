import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export default async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("session");
  const token = tokenCookie?.value;
  const { pathname } = request.nextUrl; // Obtenir le chemin de la requête

  // Définir une variable pour stocker la page de login
  let loginPage = "/";

  // Déterminer la page de login en fonction du rôle
  if (pathname.startsWith("/school-dashboard")) {
    loginPage = "/school-login";
  } else if (pathname.startsWith("/student-dashboard")) {
    loginPage = "/student-login";
  } else if (pathname.startsWith("/teacher-dashboard")) {
    loginPage = "/teacher-login";
  }

  // Si pas de token, rediriger vers la page de login appropriée
  if (!token) {
    return NextResponse.redirect(new URL(loginPage, request.url));
  }

  try {
    // Vérifier la validité du token
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    // Si le token est invalide, rediriger vers la page de login appropriée
    return NextResponse.redirect(new URL(loginPage, request.url));
  }
}

export const config = {
  matcher: [
    "/school-dashboard/:path*",
    "/student-dashboard/:path*",
    "/teacher-dashboard/:path*",
  ],
};
