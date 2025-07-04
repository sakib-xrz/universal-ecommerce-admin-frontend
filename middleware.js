import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./utils/constant";
import { cookies } from "next/headers";

const AuthRoutes = ["/login"];
const commonPrivateRoutes = ["/change-password", "/profile"];

const roleBasedPrivateRoutes = {
  SUPER_ADMIN: [/^\/super-admin/], // means any route starting with /super-admin
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Access cookies from the request headers
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  // No access token: allow login/register but redirect elsewhere if necessary
  if (!accessToken) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next(); // Allow access to login or register
    }
    return NextResponse.redirect(
      new URL(
        `/login?next=${pathname.startsWith("/") ? `${pathname.slice(1)}` : pathname}`,
        request.url,
      ),
    ); // Redirect to login if no token and accessing private route
  }

  // Decode the JWT token
  let decodedData;
  try {
    decodedData = jwtDecode(accessToken);
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url)); // Invalid token, force login
  }

  const role = decodedData?.role;

  // If token is valid and the user tries to access login/register routes, prevent loop
  if (AuthRoutes.includes(pathname)) {
    if (pathname === "/login") {
      return NextResponse.redirect(
        new URL(
          `/${role === "SUPER_ADMIN" ? "super-admin" : role.toLowerCase()}/dashboard`,
          request.url,
        ),
      ); // Already logged in, redirect to dashboard based on role
    }
  }

  // Allow access to common private routes
  if (commonPrivateRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle role-based routing for private routes
  if (role && roleBasedPrivateRoutes[role]) {
    const allowedRoutes = roleBasedPrivateRoutes[role];

    // Check if the current path matches any of the allowed role routes
    if (allowedRoutes.some((route) => route.test(pathname))) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/logout", request.url)); // Role mismatch, log the user out
    }
  }

  // Default redirect if none of the conditions match
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/login", "/super-admin/:path*"],
};
