"use client";

import {
  ChartBar,
  Tickets,
  Ticket,
  Users2,
  Users,
  MessageSquareWarning,
  GitPullRequestArrow,
  Film,
  User,
  Settings,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggler";
import LangToggler from "./langToggler";
import { getLangDir } from "rtl-detect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoutToggler from "./logoutToggler";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const dir = getLangDir(locale);
  const { open } = useSidebar();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role from localStorage on component mount
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole && ["admin", "provider"].includes(storedRole)) {
        setUserRole(storedRole);
      } else {
        // Fallback or redirect if role is invalid or not found
        setUserRole("admin"); // Default to admin if no valid role
        console.warn("No valid user role found in localStorage, defaulting to provider");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setUserRole("admin"); // Fallback role
    }
  }, []);

  const menuItems = [
    {
      title: t("dashboard"),
      url: "/provider-dashboard",
      icon: ChartBar,
      roles: ["provider"],
    },
     {
      title: t("dashboard"),
      url: "/admin-dashboard",
      icon: ChartBar,
      roles: ["admin"],
    },
    {
      title: t("coupons"),
      url: "/coupons",
      icon: Ticket,
      roles: ["admin"],
    },
     {
      title: t("coupons"),
      url: "/coupons/provider-coupons",
      icon: Ticket,
      roles: ["provider"],
    },
    {
      title: t("packages"),
      url: "/coupons/admin-packages",
      icon: Ticket,
      roles: ["admin"],
    },
     {
      title: t("packages"),
      url: "/coupons/provider-packages",
      icon: Ticket,
      roles: ["provider"],
    },
    {
      title: t("couponTypes"),
      url: "/coupons/admin-types-coupons",
      icon: Tickets,
      roles: ["admin"],
    },
     {
      title: t("couponTypes"),
      url: "/coupons/provider-types-coupons",
      icon: Tickets,
      roles: ["provider"],
    },
    {
      title: t("providers"),
      url: "/providers",
      icon: Users2,
      roles: ["admin"],
    },
    {
      title: t("customers"),
      url: "/customers",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: t("complaints"),
      url: "/complains",
      icon: MessageSquareWarning,
      roles: ["admin"],
    },
    {
      title: t("categories"),
      url: "/categories",
      icon: MessageSquareWarning,
      roles: ["admin"],
    },
    {
      title: t("events"),
      url: "/admin-events",
      icon: MessageSquareWarning,
      roles: ["admin"],
    },
      {
      title: t("events"),
      url: "/provider-events",
      icon: MessageSquareWarning,
      roles: ["provider"],
    },
    {
      title: t("requests"),
      url: "/requests",
      icon: GitPullRequestArrow,
      roles: ["admin", "provider"],
    },
    {
      title: t("reels"),
      url: "/reels",
      icon: Film,
      roles: ["admin", "provider"],
    },
  ];

  // Filter menu items based on user role (only if userRole is set)
  const filteredMenuItems = userRole
    ? menuItems.filter((item) => item.roles.includes(userRole))
    : [];

  return (
    <Sidebar
      side={dir === "rtl" ? "right" : "left"}
      collapsible="icon"
      className="border-r bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-none"
    >
      {/* Header */}
      <SidebarHeader
        className={cn(
          "transition-all duration-300 overflow-hidden py-4",
          open ? "opacity-100 max-h-24" : "opacity-0 max-h-0 p-0"
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
            {t("title")}
          </h1>
        </div>
        <SidebarSeparator className="mt-2 border-gray-200 dark:border-gray-700" />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          {/* Profile */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="group">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 rounded-sm transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <User className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {t("profile")}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator className="my-2 border-gray-200 dark:border-gray-700" />

          {/* Main Navigation */}
          <SidebarGroupLabel className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
            {t("navigation")}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="group">
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 p-3 rounded-sm hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                  {t("noMenuItems")}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Settings */}
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full rounded-xl transition-all duration-300",
                open
                  ? "justify-start gap-3 px-3 py-6 hover:bg-blue-100/60 dark:hover:bg-blue-900/40"
                  : "justify-center hover:bg-blue-100/40 dark:hover:bg-blue-900/20"
              )}
            >
              <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              {open && (
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {t("settings")}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-bottom-2 duration-300"
            align={dir === "rtl" ? "end" : "start"}
          >
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200">
                  <ModeToggle />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubTrigger className="hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200">
                  <LangToggler />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubTrigger className="hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200">
                  <LogoutToggler />
                </DropdownMenuSubTrigger>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// // "use client";
// // import { useTranslations } from "next-intl";
// // import {
// //   LayoutDashboard,
// //   User,
// //   Ticket,
// //   Video,
// //   Tag,
// //   Users,
// //   UserCheck,
// //   AlertCircle,
// //   FileText,
// //   Settings,
// // } from "lucide-react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import LogoutToggler from "./logoutToggler";

// // interface AppSidebarProps {
// //   role: "admin" | "provider";
// // }

// // export default function AppSidebar({ role }: AppSidebarProps) {
// //   const t = useTranslations("Sidebar");
// //   const pathname = usePathname();

// //   const providerNavItems = [
// //     { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
// //     { name: t("profile"), href: "/profile", icon: User },
// //     { name: t("coupons"), href: "/coupons", icon: Ticket },
// //     { name: t("reels"), href: "/reels", icon: Video },
// //   ];

// //   const adminNavItems = [
// //     ...providerNavItems,
// //     { name: t("couponTypes"), href: "/coupon-types", icon: Tag },
// //     { name: t("providers"), href: "/providers", icon: UserCheck },
// //     { name: t("customers"), href: "/customers", icon: Users },
// //     { name: t("complaints"), href: "/complaints", icon: AlertCircle },
// //     { name: t("requests"), href: "/requests", icon: FileText },
// //     { name: t("settings"), href: "/settings", icon: Settings },
// //   ];

// //   const navItems = role === "admin" ? adminNavItems : providerNavItems;

// //   return (
// //     <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 fixed h-screen flex flex-col">
// //       <h2 className="text-xl font-bold text-primary dark:text-primary-dark mb-6">
// //         {t("title")}
// //       </h2>
// //       <nav className="flex-1">
// //         <h3 className="text-sm font-semibold text-muted-foreground dark:text-muted-dark mb-4">
// //           {t("navigation")}
// //         </h3>
// //         <ul className="space-y-2">
// //           {navItems.map((item) => (
// //             <li key={item.href}>
// //               <Link
// //                 href={item.href}
// //                 className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
// //                   pathname === item.href
// //                     ? "bg-primary/10 text-primary dark:text-primary-dark"
// //                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
// //                 }`}
// //               >
// //                 <item.icon className="w-5 h-5 mr-3" />
// //                 <span>{item.name}</span>
// //               </Link>
// //             </li>
// //           ))}
// //         </ul>
// //       </nav>
// //       <div className="mt-auto">
// //         <LogoutToggler />
// //       </div>
// //     </aside>
// //   );
// // }

// import {
//   Calendar,
//   ChartBar,
//   ChevronUp,
//   Film,
//   GitPullRequest,
//   GitPullRequestArrow,
//   Home,
//   Inbox,
//   Keyboard,
//   Mail,
//   MessageSquare,
//   MessageSquareWarning,
//   Plus,
//   PlusCircle,
//   Search,
//   Settings,
//   Tickets,
//   Ticket,
//   User,
//   User2,
//   UserPlus,
//   Users,
//   Users2,
// } from "lucide-react";
// import { useLocale, useTranslations } from "next-intl";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarSeparator,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { ModeToggle } from "./mode-toggler";
// import LangToggler from "./langToggler";
// import { getLangDir } from "rtl-detect";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import router from "next/router";
// import LogoutToggler from "./logoutToggler";

// export function AppSidebar() {
//   const t = useTranslations("Sidebar");
//   const locale = useLocale();
//   const dir = getLangDir(locale);

//   const { open } = useSidebar();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//     router.push("/auth/login");
//   };

//   const handleClearCache = () => {
//     localStorage.clear();
//     window.location.reload();
//   };

//   const menuItems = [
//     {
//       title: t("dashboard"),
//       url: "/dashboard",
//       icon: ChartBar,
//     },
//     {
//       title: t("coupons"),
//       url: "/coupons",
//       icon: Ticket,
//     },
//     {
//       title: t("couponTypes"),
//       url: "/coupons/types-coupons-admin",
//       icon: Tickets,
//     },
//     {
//       title: t("providers"),
//       url: "/providers",
//       icon: Users2,
//     },
//     {
//       title: t("customers"),
//       url: "/customers",
//       icon: Users,
//     },
//     {
//       title: t("complaints"),
//       url: "/complaints",
//       icon: MessageSquareWarning,
//     },
//     {
//       title: t("requests"),
//       url: "/requests",
//       icon: GitPullRequestArrow,
//     },
//     {
//       title: t("reels"),
//       url: "/reels",
//       icon: Film,
//     },
//   ];

//   return (
//     <Sidebar
//       side={dir === "rtl" ? "right" : "left"}
//       collapsible="icon"
//       className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
//     >
//       <SidebarHeader
//         className={`p-4 transition-all duration-200 ease-in-out overflow-hidden ${
//           open ? "opacity-100 max-h-24" : "opacity-0 max-h-0 p-0"
//         }`}
//       >
//         <div className="flex items-center justify-between">
//           <h1 className="text-lg font-semibold">{t("title")}</h1>
//         </div>
//         <SidebarSeparator className="mt-2" />
//       </SidebarHeader>

//       <SidebarContent className={`${open ? "overflow-hidden" : ""}`}>
//         <SidebarGroup>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton asChild className="">
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-3  rounded-lg hover:bg-accent transition-colors"
//                 >
//                   <User className=" text-primary" />
//                   <span>{t("profile")}</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//           <SidebarSeparator className="my-2" />

//           <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
//             {t("navigation")}
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <Link
//                       href={item.url}
//                       className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
//                     >
//                       <item.icon className="h-5 w-5 text-muted-foreground" />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className={`w-full ${open ? "justify-start gap-3 px-2" : ""}`}
//             >
//               <Settings className="h-5 w-5" />
//               {open && <span>{t("settings")}</span>}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-56"
//             align={dir === "rtl" ? "end" : "start"}
//           >
//             <DropdownMenuGroup>
//               {/* <DropdownMenuLabel>{t("appearance")}</DropdownMenuLabel> */}
//               <DropdownMenuSub>
//                 <DropdownMenuSubTrigger>
//                   <ModeToggle />
//                 </DropdownMenuSubTrigger>

//                 <DropdownMenuSubTrigger>
//                   <LangToggler />
//                 </DropdownMenuSubTrigger>
//                 <DropdownMenuSubTrigger>
//                   <LogoutToggler />
//                 </DropdownMenuSubTrigger>
//               </DropdownMenuSub>
//             </DropdownMenuGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
