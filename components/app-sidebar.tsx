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

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const dir = getLangDir(locale);

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
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-2"
            >
              <Settings className="h-5 w-5" />
              <span>{t("settings")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={dir === "rtl" ? "end" : "start"}>
            <DropdownMenuGroup>
              {/* <DropdownMenuLabel>{t("appearance")}</DropdownMenuLabel> */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <ModeToggle />
                </DropdownMenuSubTrigger>
            
                <DropdownMenuSubTrigger>
                    <LangToggler />
                </DropdownMenuSubTrigger>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}