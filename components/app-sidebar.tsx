"use client";

import {
  ChartBar,
  Ticket,
  Users2,
  Users,
  MessageSquareWarning,
  GitPullRequestArrow,
  Film,
  User,
  Settings,
  LayoutGrid,
  Tag,
  Package,
  FolderTree,
  Calendar,
  Filter,
  Star,
  Camera,
  ShieldAlert,
  ListTree,
  BadgePercent,
  Sparkles,
  ClipboardCheck
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
import Cookies from "js-cookie";

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const dir = getLangDir(locale);
  const { open } = useSidebar();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role from localStorage on component mount
  useEffect(() => {
    try {
      const storedRole = Cookies.get("userRole");
      if (storedRole && ["admin", "provider"].includes(storedRole)) {
        setUserRole(storedRole);
      } else {
        setUserRole("admin");
        console.warn(
          "No valid user role found in localStorage, defaulting to admin",
        );
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setUserRole("admin");
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
      icon: Package,
      roles: ["admin"],
    },
    {
      title: t("packages"),
      url: "/coupons/provider-packages",
      icon: Package,
      roles: ["provider"],
    },
    {
      title: t("couponTypes"),
      url: "/coupons/admin-types-coupons",
      icon: Tag,
      roles: ["admin"],
    },
    {
      title: t("couponTypes"),
      url: "/coupons/provider-types-coupons",
      icon: Tag,
      roles: ["provider"],
    },
    {
      title: t("miniActions"),
      url: "/mini-actions",
      icon: Sparkles,
      roles: ["provider"],
    },
    {
      title: t("miniActionsProof"),
      url: "/mini-actions-proof",
      icon: ClipboardCheck,
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
      icon: LayoutGrid,
      roles: ["admin"],
    },
    {
      title: t("events"),
      url: "/admin-events",
      icon: Calendar,
      roles: ["admin"],
    },
    {
      title: t("events"),
      url: "/provider-events",
      icon: Calendar,
      roles: ["provider"],
    },
    {
      title: t("requests"),
      url: "/requests",
      icon: GitPullRequestArrow,
      roles: ["admin"],
    },
    {
      title: t("reels"),
      url: "/reels",
      icon: Film,
      roles: ["admin", "provider"],
    },
    {
      title: t("criteria"),
      url: "/add-criteria",
      icon: Filter,
      roles: ["admin"],
    },
  ];

  // Filter menu items based on user role
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
          open ? "opacity-100 max-h-24" : "opacity-0 max-h-0 p-0",
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
                  className="flex items-center gap-3 p-3 rounded-sm transition-all duration-50 transform hover:scale-[1.02]"
                >
                  <User className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-15000" />
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
                        className="flex items-center gap-3 p-3 rounded-sm hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-all duration-100 transform hover:scale-[1.02]"
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
                  : "justify-center hover:bg-blue-100/40 dark:hover:bg-blue-900/20",
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