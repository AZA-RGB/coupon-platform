"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppBreadcrumb } from "@/components/app-breadcrumb/AppBreadcrumb";
import { SWRProvider } from "@/components/ui/swrProvier";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  // Redirect to /dashboard if token exists and user is on an auth page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isAuthPage) {
      router.push("/admin-dashboard");
    }
  }, [router, isAuthPage]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {isAuthPage ? (
        // Render only children for auth pages
        <>
          <SWRProvider>
            <main>{children}</main>
            <NextTopLoader color="#00CBC1" height={5} crawl={false} />
            <Toaster richColors position="top-center" />
          </SWRProvider>
        </>
      ) : (
        // Render sidebar and full layout for non-auth pages
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SWRProvider>
              <main className="">
                <div className="flex gap-5 sticky top-0 items-center backdrop-blur-xl z-50">
                  <SidebarTrigger className="bg-primary dark:bg-primary-dark text-white m-1 rounded-md p-2 hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-all" />
                  <AppBreadcrumb />
                </div>
                <NextTopLoader color="#00CBC1" height={5} crawl={false} />
                {children}
              </main>
              <Toaster richColors position="top-center" />
            </SWRProvider>
          </SidebarInset>
        </SidebarProvider>
      )}
    </ThemeProvider>
  );
}



// "use client";
// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useTranslations } from "next-intl";
// import { jwtDecode } from "jwt-decode";
// import AppSidebar from "@/components/app-sidebar";

// interface DecodedToken {
//   role: "admin" | "provider";
//   // Add other token fields as needed (e.g., exp, userId)
// }

// export default function ClientLayout({ children }: { children: React.ReactNode }) {
//   const t = useTranslations("Auth");
//   const pathname = usePathname();
//   const router = useRouter();
//   const [role, setRole] = useState<"admin" | "provider" | null>(null);

//   const authRoutes = [
//     "/auth",
//     "/auth/login",
//     "/auth/register",
//     "/auth/forget-password",
//     "/auth/verify-code-password",
//     "/auth/reset-password",
//   ];

//   const providerRoutes = ["/dashboard", "/profile", "/coupons", "/reels"];
//   const adminRoutes = [
//     "/dashboard",
//     "/profile",
//     "/coupons",
//     "/reels",
//     "/coupon-types",
//     "/providers",
//     "/customers",
//     "/complaints",
//     "/requests",
//     "/settings",
//   ];

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       try {
//         const decoded: DecodedToken = jwtDecode(token);
//         setRole(decoded.role);

//         // Redirect authenticated users away from auth routes
//         if (authRoutes.includes(pathname)) {
//           router.push("/dashboard");
//           toast.info(t("alreadyLoggedIn"), {
//             description: t("alreadyLoggedInDesc"),
//             duration: 3000,
//           });
//         }
//         // Check role-based access for non-auth routes
//         else if (!authRoutes.includes(pathname)) {
//           if (decoded.role === "provider" && !providerRoutes.includes(pathname)) {
//             router.push("/dashboard");
//             toast.error(t("accessDenied"), {
//               description: t("accessDeniedDesc"),
//               duration: 5000,
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Invalid token:", error);
//         localStorage.removeItem("token");
//         if (!authRoutes.includes(pathname)) {
//           router.push("/auth");
//           toast.error(t("invalidToken"), {
//             description: t("invalidTokenDesc"),
//             duration: 5000,
//           });
//         }
//       }
//     } else {
//       // Redirect unauthenticated users to /auth for non-auth routes
//       if (!authRoutes.includes(pathname)) {
//         router.push("/auth");
//         toast.error(t("loginRequired"), {
//           description: t("loginRequiredDesc"),
//           duration: 5000,
//         });
//       }
//     }
//   }, [pathname, router, t]);

//   return (
//     <div className="flex min-h-screen">
//       {role && !authRoutes.includes(pathname) && <AppSidebar role={role} />}
//       <main className="flex-1 p-4 sm:p-6">
//         {children}
//       </main>
//     </div>
//   );
// }
