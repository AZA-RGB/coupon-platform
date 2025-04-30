"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUserLocale } from "@/utils/i18nUtil";

export default function LangToggler() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="flex place-content-between w-full"
      >
        <Button variant="outline">
        Languages
          <Languages />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setUserLocale("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setUserLocale("ar")}>
          ara
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
