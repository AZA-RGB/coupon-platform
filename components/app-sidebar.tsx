// "use client";
// import { useTranslations } from "next-intl";
// import {
//   LayoutDashboard,
//   User,
//   Ticket,
//   Video,
//   Tag,
//   Users,
//   UserCheck,
//   AlertCircle,
//   FileText,
//   Settings,
// } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import LogoutToggler from "./logoutToggler";

// interface AppSidebarProps {
//   role: "admin" | "provider";
// }

// export default function AppSidebar({ role }: AppSidebarProps) {
//   const t = useTranslations("Sidebar");
//   const pathname = usePathname();

//   const providerNavItems = [
//     { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
//     { name: t("profile"), href: "/profile", icon: User },
//     { name: t("coupons"), href: "/coupons", icon: Ticket },
//     { name: t("reels"), href: "/reels", icon: Video },
//   ];

//   const adminNavItems = [
//     ...providerNavItems,
//     { name: t("couponTypes"), href: "/coupon-types", icon: Tag },
//     { name: t("providers"), href: "/providers", icon: UserCheck },
//     { name: t("customers"), href: "/customers", icon: Users },
//     { name: t("complaints"), href: "/complaints", icon: AlertCircle },
//     { name: t("requests"), href: "/requests", icon: FileText },
//     { name: t("settings"), href: "/settings", icon: Settings },
//   ];

//   const navItems = role === "admin" ? adminNavItems : providerNavItems;

//   return (
//     <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 fixed h-screen flex flex-col">
//       <h2 className="text-xl font-bold text-primary dark:text-primary-dark mb-6">
//         {t("title")}
//       </h2>
//       <nav className="flex-1">
//         <h3 className="text-sm font-semibold text-muted-foreground dark:text-muted-dark mb-4">
//           {t("navigation")}
//         </h3>
//         <ul className="space-y-2">
//           {navItems.map((item) => (
//             <li key={item.href}>
//               <Link
//                 href={item.href}
//                 className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
//                   pathname === item.href
//                     ? "bg-primary/10 text-primary dark:text-primary-dark"
//                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 <item.icon className="w-5 h-5 mr-3" />
//                 <span>{item.name}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//       <div className="mt-auto">
//         <LogoutToggler />
//       </div>
//     </aside>
//   );
// }










import {
  Calendar,
  ChartBar,
  ChevronUp,
  Film,
  GitPullRequest,
  GitPullRequestArrow,
  Home,
  Inbox,
  Keyboard,
  Mail,
  MessageSquare,
  MessageSquareWarning,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Tickets,
  Ticket,
  User,
  User2,
  UserPlus,
  Users,
  Users2,
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
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggler";
import LangToggler from "./langToggler";
import { getLangDir } from "rtl-detect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import router from "next/router";
import LogoutToggler from "./logoutToggler";

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const dir = getLangDir(locale);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/auth/login");
  };

  const handleClearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const menuItems = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: ChartBar,
    },
    {
      title: t("coupons"),
      url: "/coupons",
      icon: Ticket,
    },
    {
      title: t("couponTypes"),
      url: "/coupons/types-all-coupons",
      icon: Tickets,
    },
    {
      title: t("providers"),
      url: "/providers",
      icon: Users2,
    },
    {
      title: t("customers"),
      url: "/customers",
      icon: Users,
    },
    {
      title: t("complaints"),
      url: "/complaints",
      icon: MessageSquareWarning,
    },
    {
      title: t("requests"),
      url: "/requests",
      icon: GitPullRequestArrow,
    },
    {
      title: t("reels"),
      url: "/reels",
      icon: Film,
    },
  ];

  return (
    <Sidebar
      side={dir === "rtl" ? "right" : "left"}
      collapsible="icon"
      variant="default"
      className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{t("title")}</h1>
        </div>
        <SidebarSeparator className="my-2" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <User className="h-5 w-5 text-primary" />
                  <span>{t("profile")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator className="my-2" />

          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            {t("navigation")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-2">
              <Settings className="h-5 w-5" />
              <span>{t("settings")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align={dir === "rtl" ? "end" : "start"}
          >
            <DropdownMenuGroup>
              {/* <DropdownMenuLabel>{t("appearance")}</DropdownMenuLabel> */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ModeToggle />
                </DropdownMenuSubTrigger>

                <DropdownMenuSubTrigger>
                  <LangToggler />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubTrigger>
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
