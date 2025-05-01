import {
  Calendar,
  ChartNoAxesCombined,
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
  TicketX,
  User,
  User2,
  UserPlus,
  Users,
  Users2,
  UsersRound,
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
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";

export function AppSidebar() {
  const t = useTranslations();
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Coupons",
      url: "/",
      icon: TicketX,
    },
    {
      title: "Coupon types",
      url: "/",
      icon: Tickets,
    },
    {
      title: 'Providers',
      url: "/",
      icon: UsersRound,
    },
    {
      title: 'Customers',
      url: "/",
      icon: Users,
    },
    {
      title: 'Complains',
      url: "/",
      icon: MessageSquareWarning,
    },
    {
      title: 'Requests',
      url: "/requests",
      icon: GitPullRequestArrow,
    },
    {
      title: "Reels",
      url: "/",
      icon: Film,
    },
  ];
  const locale = useLocale();
  const dir = getLangDir(locale);
  return (
    <Sidebar
      side={getLangDir(useLocale()) == "rtl" ? "right" : "left"}
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex place-content-between">
              <User/>
              Mangae Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="flex justify-between">
                    <Link  href={item.url}>
                      <item.icon className="text-primary h-5 w-5"/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton asChild className="flex justify-between">
              <div>
                <Settings />
                <span>Settings</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex place-content-between">
                  <ModeToggle />
                </DropdownMenuSubTrigger>
            <DropdownMenuSeparator />
                <DropdownMenuSubTrigger className="flex place-content-between">
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
