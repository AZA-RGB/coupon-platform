"use client"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

export function AppBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(segment => segment !== '')

  // Customize these names as needed
  const pathNames: Record<string, string> = {
    'docs': 'Documentation',
    'components': 'Components',
    // Add more mappings as needed
  }

  // Function to generate dropdown items for intermediate paths
  const generateDropdownItems = (currentIndex: number) => {
    const previousPaths = pathSegments.slice(0, currentIndex)
    const remainingPaths = pathSegments.slice(currentIndex + 1)
    
    const items = remainingPaths.map((path, index) => {
      const fullPath = `/${[...previousPaths, path].join('/')}`
      return (
        <DropdownMenuItem key={index}>
          <BreadcrumbLink href={fullPath}>
            {pathNames[path] || path.charAt(0).toUpperCase() + path.slice(1)}
          </BreadcrumbLink>
        </DropdownMenuItem>
      )
    })

    return items
  }

  return (
    <Breadcrumb className={cn("", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.length > 0 && <BreadcrumbSeparator />}

        {pathSegments.length > 3 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {generateDropdownItems(0)}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {pathSegments.slice(0, pathSegments.length > 3 ? 3 : pathSegments.length).map((segment, index) => {
          const isLast = index === pathSegments.length - 1
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`
          const displayName = pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path}>{displayName}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}