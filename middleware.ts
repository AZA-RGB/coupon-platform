import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token");
  const userRole = request.cookies.get("userRole")?.value;

  // Public paths that don't require authentication
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forget-password",
    "/",
  ];

  // Allow public paths and Next.js internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    publicPaths.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Define all routes with their exact required roles (from your menuItems)
  const roleProtectedRoutes = [
    { path: "/provider-dashboard", roles: ["provider"] },
    { path: "/admin-dashboard", roles: ["admin"] },
    { path: "/coupons", roles: ["admin"] },
    { path: "/coupons/provider-coupons", roles: ["provider"] },
    { path: "/coupons/admin-packages", roles: ["admin"] },
    { path: "/coupons/provider-packages", roles: ["provider"] },
    { path: "/coupons/admin-types-coupons", roles: ["admin"] },
    { path: "/coupons/provider-types-coupons", roles: ["provider"] },
    { path: "/providers", roles: ["admin"] },
    { path: "/customers", roles: ["admin"] },
    { path: "/complains", roles: ["admin"] },
    { path: "/categories", roles: ["admin"] },
    { path: "/admin-events", roles: ["admin"] },
    { path: "/provider-events", roles: ["provider"] },
    { path: "/requests", roles: ["admin", "provider"] },
    { path: "/reels", roles: ["admin", "provider"] },
    { path: "/add-criteria", roles: ["admin", "provider"] },
  ];

  // Find if current path is protected
  const routeConfig = roleProtectedRoutes.find(
    (route) => pathname === route.path, // Handle nested routes
  );
  console.log("hellllllllllllllo", routeConfig);

  // If route is not in our protected list, allow access
  if (!routeConfig) {
    return NextResponse.next();
  }

  // Check if user has required role
  if (routeConfig.roles.includes(userRole)) {
    return NextResponse.next();
  }

  // User doesn't have permission - redirect appropriately
  if (userRole === "admin") {
    // Admin trying to access provider route? Send to admin dashboard
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  } else if (userRole === "provider") {
    // Provider trying to access admin route? Send to provider dashboard
    return NextResponse.redirect(new URL("/provider-dashboard", request.url));
  }

  // Fallback for invalid roles
  return NextResponse.redirect(new URL("/auth/login", request.url));
}
