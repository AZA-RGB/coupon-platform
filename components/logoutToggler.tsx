"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LogoutToggler() {
  const t = useTranslations("LogoutToggler");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full justify-start text-foreground dark:text-foreground-dark hover:bg-accent dark:hover:bg-accent-dark"
        >
          <LogOut className="h-5 w-5" />
          <span>{t("logout")}</span>
        </Button>
      </DropdownMenuTrigger>
    
    </DropdownMenu>
  );
}