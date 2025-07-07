"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function AppBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Customize these names as needed
  const pathNames: Record<string, string> = {
    // 'coupons': "Coupons",
    // Add more mappings as needed
  };

  return (
    <Breadcrumb className={cn("", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const displayName =
            pathNames[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <Fragment key={index}>
              <BreadcrumbSeparator className="rtl:rotate-180" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path}>{displayName}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
