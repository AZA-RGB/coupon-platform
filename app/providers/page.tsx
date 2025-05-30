"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allProvidersData, requestsData, topCategoriesData } from "./constants";

const providerS_PER_PAGE = 10;

const TopCategoriesCard = ({ t, topCategoriesData }) => {
  return (
    <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
      <CardTitle className="text-lg text-primary mb-1">
        {t("topCategories")}
      </CardTitle>
      <div className="space-y-4">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4 text-start">
                {t("rank")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("category")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("sales")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("popularity")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCategoriesData.slice(0, 5).map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{row.rank}</TableCell>
                <TableCell className="py-2 px-4">{row.category}</TableCell>
                <TableCell className="py-2 px-4">{row.sales}</TableCell>
                <TableCell className="py-2 px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${row.popularity}%` }}
                    ></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

const handleAction = (id, action) => {
  console.log(`Action: ${action} for request ID: ${id}`);
};

const RequestsCard = ({ t, requestsData }) => {
  return (
    <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
      <CardTitle className="mb-1 flex justify-between">
        <span className="text-lg text-primary">{t("requests")}</span>

        <Link
          href={`/dashboard/requests`}
          className="text-sm hover:text-foreground/80"
        >
          {t("view_all")}
        </Link>
        {/* <span className="text-sm"></span> */}
      </CardTitle>
      <div className="space-y-4">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4 text-start">
                {t("name")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("requestDateTime")}
              </TableHead>
              <TableHead className="py-2 px-4 text-center">
                {t("action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestsData.slice(0, 5).map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{row.name}</TableCell>
                <TableCell className="py-2 px-4">
                  {row.requestDateTime}
                </TableCell>
                <TableCell className="py-2 px-4">
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 cursor-pointer text-white px-1 py-1 rounded hover:bg-green-600"
                      onClick={() => handleAction(row.id, "accept")}
                    >
                      {t("accept")}
                    </button>
                    <button
                      className="bg-red-500 cursor-pointer text-white px-1 py-1 rounded hover:bg-red-600"
                      onClick={() => handleAction(row.id, "reject")}
                    >
                      {t("reject")}
                    </button>
                    <button
                      className="bg-blue-500 cursor-pointer text-white px-1 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleAction(row.id, "viewDetails")}
                    >
                      {t("viewDetails")}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

const ProvidersTable = ({
  t,
  coupons,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Define columns in natural LTR provider
  const columns = useMemo(
    () => [
      { key: "userInfo", label: t("userInfo") || "User Info" },
      { key: "phone", label: t("phone") || "Phone" },
      { key: "requestDate", label: t("request_date") || "Request Date" },
      { key: "status", label: t("status") || "Status" },
      { key: "coupons", label: t("coupons") || "Coupons" },
      { key: "packages", label: t("packages") || "Packages" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t]
  );

  // Reverse data for RTL display
  const displayedData = useMemo(
    () => (isRTL ? [...coupons].reverse() : coupons),
    [coupons, isRTL]
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-x-2">
        <div className="overflow-x-auto">
          <div className="rounded-md bprovider" dir={isRTL ? "rtl" : "ltr"}>
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`px-4 py-3 font-medium ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedData.map((provider) => (
                  <TableRow
                    key={provider.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={`${provider.id}-${column.key}`}
                        className={`px-4 py-3 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {renderTableCellContent(
                          provider,
                          column.key,
                          isRTL,
                          t,
                          formatDate
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Pagination className="w-full">
          <PaginationContent
            className={`w-full ${isRTL ? "justify-center" : "justify-center"}`}
          >
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                className="cursor-pointer"
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

// Helper component to render table cell content
function renderTableCellContent(provider, key, isRTL, t, formatDate) {
  switch (key) {
    case "userInfo":
      return (
        <div className={`flex items-center ${"flex-row"} gap-2`}>
          <div className="relative w-9 h-10">
            <Image
              src={provider.image}
              alt={provider.name}
              fill
              className="rounded-[10px] object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{provider.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {provider.email}
            </span>
          </div>
        </div>
      );

    case "phone":
      return (
        <span
          style={{
            direction: "ltr",
            unicodeBidi: "isolate",
            display: "inline-block",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {provider.phone}
        </span>
      );

    case "requestDate":
      return formatDate(provider.requestDate);


    case "status":
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            provider.status === "active"
              ? "bg-green-100 text-green-800"
              : provider.status === "expired"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {t(provider.status)}
        </span>
      );

    case "coupons":
      return `${provider.totalCoupons}`

      case "packages":
      return `${provider.totalPackages}`

    case "actions":
      return (
        <Link
          href={`/dashboard/providers/${provider.id}`}
          className="text-sm text-primary underline hover:text-primary/80"
        >
          {t("viewDetails")}
        </Link>
      );

    default:
      return null;
  }
}

export default function AllprovidersDashboard() {
  const t = useTranslations("Providers");
  const { locale } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  // Reset currentPage to 1 when searchTerm or filterType changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const filteredproviders = useMemo(() => {
    // Ensure allprovidersData is an array
    const providers = Array.isArray(allProvidersData) ? allProvidersData : [];

    return providers
      .filter((provider) => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
          (typeof provider.name === "string" &&
            provider.name.toLowerCase().includes(lowerSearch)) ||
          (typeof provider.email === "string" &&
            provider.email.toLowerCase().includes(lowerSearch)) ||
          (typeof provider.phone === "string" &&
            provider.phone.toLowerCase().includes(lowerSearch))
        );
      })
      .filter((provider) => {
        if (["active", "expired", "pending"].includes(filterType)) {
          return (
            typeof provider.status === "string" &&
            provider.status.toLowerCase() === filterType.toLowerCase()
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (filterType === "newest" || filterType === "oldest") {
          const dateA = a.addDate ? new Date(a.addDate) : new Date(0);
          const dateB = b.addDate ? new Date(b.addDate) : new Date(0);
          // Check if dates are valid
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
          return filterType === "newest"
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredproviders.length / providerS_PER_PAGE) || 1;
  const currentproviders = filteredproviders.slice(
    (currentPage - 1) * providerS_PER_PAGE,
    currentPage * providerS_PER_PAGE
  );

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("active"), value: "active" },
    { label: t("expired"), value: "expired" },
    { label: t("pending"), value: "pending" },
  ];

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {/* Section 1: Summary and Navigation */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <TopCategoriesCard t={t} topCategoriesData={topCategoriesData} />
        <RequestsCard t={t} requestsData={requestsData} />
      </div>

      {/* Section 2: Header with Filter and Search */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {t("filter")}
              </Button>
              {isFilterMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-40 bg-secondary bprovider rounded shadow">
                  {filterOptions.map((item) => (
                    <button
                      key={item.value}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-100 ${
                        filterType === item.value
                          ? "bg-gray-200 dark:bg-gray-100"
                          : ""
                      }`}
                      onClick={() => {
                        setFilterType(item.value);
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder={t("search")}
                className="h-8 max-w-[200px]"
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
              <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Section 3: providers Table */}
      <ProvidersTable
        t={t}
        coupons={currentproviders}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
