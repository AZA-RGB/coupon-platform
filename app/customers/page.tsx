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
import { allCustomersData } from "./constants";

const CUSTOMERS_PER_PAGE = 10;

const SummaryCards = ({ t }) => {
  const summaries = [
    {
      title: t("totalCustomers"),
      value: "$24,560",
      change: "+8% from last month",
    },
    {
      title: t("newCustomers"),
      value: "$24,560",
      change: "+8% from last month",
    },
    {
      title: t("activeCustomers"),
      value: "$24,560",
      change: "+8% from last month",
    },
  ];

  return (
    <Card className="w-full lg:w-3/4 p-4 hidden md:flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {summaries.map((summary, index) => (
          <div key={index} className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h2>{summary.title}</h2>
              <h4 className="text-2xl">{summary.value}</h4>
            </div>
            <span className="text-sm text-green-500 mt-2">
              {summary.change}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MobileSummaryCards = ({ t }) => {
  const summaries = [
    {
      title: t("totalCustomers"),
      value: "$24,560",
      change: "+8% from last month",
    },
    {
      title: t("newCustomers"),
      value: "$24,560",
      change: "+8% from last month",
    },
    {
      title: t("activeCustomers"),
      value: "$24,560",
      change: "+8% from last month",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {summaries.map((summary, index) => (
        <Card key={index} className="w-full p-4 flex flex-col justify-between">
          <div>
            <h2>{summary.title}</h2>
            <h4 className="text-2xl">{summary.value}</h4>
          </div>
          <span className="text-sm text-green-500 mt-2">{summary.change}</span>
        </Card>
      ))}
    </div>
  );
};

const NavigationCards = ({ t }) => {
  return (
    <div className="w-full lg:w-1/4">
      <Link href="/dashboard/top-customers" className="block h-full">
        <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-4">
          <CardTitle className="text-lg text-primary mb-1">
            {t("seeTopCustomers")}
          </CardTitle>
          <CardDescription>{t("seeTopCustomersDesc")}</CardDescription>
        </Card>
      </Link>
    </div>
  );
};

const CustomersTable = ({
  t,
  coupons,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Define columns in natural LTR order
  const columns = useMemo(
    () => [
      { key: "userInfo", label: t("userInfo") || "User Info" },
      { key: "phone", label: t("phone") || "Phone" },
      { key: "subscribeDate", label: t("subscribeDate") || "Subscribe Date" },
      { key: "status", label: t("status") || "Status" },
      { key: "coupons", label: t("coupons") || "Coupons" },
      { key: "banned", label: t("banned") || "Banned" },
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
          <div className="rounded-md border" dir={isRTL ? "rtl" : "ltr"}>
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
                {displayedData.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={`${customer.id}-${column.key}`}
                        className={`px-4 py-3 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {renderTableCellContent(
                          customer,
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
function renderTableCellContent(customer, key, isRTL, t, formatDate) {
  switch (key) {
    case "userInfo":
      return (
        <div className={`flex items-center ${"flex-row"} gap-2`}>
          <div className="relative w-9 h-10">
            <Image
              src={customer.image}
              alt={customer.name}
              fill
              className="rounded-[10px] object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{customer.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {customer.email}
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
          {customer.phone}
        </span>
      );

    case "subscribeDate":
      return formatDate(customer.subscribeDate);

    case "status":
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            customer.status === "active"
              ? "bg-green-100 text-green-800"
              : customer.status === "unBanned"
              ? "bg-blue-100 text-blue-800"
              : customer.status === "banned"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {t(customer.status)}
        </span>
      );

    case "coupons":
      return `${customer.totalCoupons}`;

    case "banned":
      return (
        <Link href={`/dashboard/customers/${customer.status === "active" ? "banned" : "unbanned"}/${customer.id}`}>
          <Button
            variant="default"
            size="sm"
            className={ "cursor-pointer " +`${
             
              customer.status === "active"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }` }
          >
            {t(customer.status === "active" ? "ban" : "unBan")}
          </Button>
        </Link>
      );

    case "actions":
      return (
        <Link
          href={`/dashboard/customers/${customer.id}`}
          className="text-sm text-primary underline hover:text-primary/80"
        >
          {t("viewDetails")}
        </Link>
      );

    default:
      return null;
  }
}

export default function AllCustomersDashboard() {
  const t = useTranslations("Customers");
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

  const filteredCustomers = useMemo(() => {
    // Ensure allCustomersData is an array
    const customers = Array.isArray(allCustomersData) ? allCustomersData : [];

    return customers
      .filter((customer) => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
          (typeof customer.name === "string" &&
            customer.name.toLowerCase().includes(lowerSearch)) ||
          (typeof customer.email === "string" &&
            customer.email.toLowerCase().includes(lowerSearch)) ||
          (typeof customer.phone === "string" &&
            customer.phone.toLowerCase().includes(lowerSearch))
        );
      })
      .filter((customer) => {
        if (["active", "unBanned", "banned"].includes(filterType)) {
          return (
            typeof customer.status === "string" &&
            customer.status.toLowerCase() === filterType.toLowerCase()
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

  const totalPages = Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE) || 1;
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * CUSTOMERS_PER_PAGE,
    currentPage * CUSTOMERS_PER_PAGE
  );

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("active"), value: "active" },
    { label: t("unBanned"), value: "unBanned" },
    { label: t("banned"), value: "banned" },
  ];

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {/* Section 1: Summary and Navigation */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <SummaryCards t={t} />
        <MobileSummaryCards t={t} />
        <NavigationCards t={t} />
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
                <div className="absolute right-0 z-10 mt-2 w-40 bg-secondary border rounded shadow">
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

      {/* Section 3: Customers Table */}
      <CustomersTable
        t={t}
        coupons={currentCustomers}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}