import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {useLocale, useTranslations} from 'next-intl'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggler"

import LangToggler from "./langToggler"
import {getLangDir} from "rtl-detect";

export function AppSidebar() {
const t =useTranslations ()
// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: t('search'),
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]
  const locale = useLocale();
  const dir =getLangDir(locale);
  return (
    <Sidebar side={getLangDir(useLocale())=='rtl' ?"right":"left"}>
      <SidebarHeader>
        <div className="flex place-content-between">

        <LangToggler />
        <ModeToggle/>
        </div>

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="flex justify-between">
                    <a href={item.url}>
                      <span>{item.title}</span>
                      <item.icon />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
