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
import { allOrdersData, requestsData, topCategoriesData } from "./constants";

const ORDERS_PER_PAGE = 10;

const TopCategoriesCard = ({ t, topCategoriesData }) => {
  return (
    <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
      <CardTitle className="text-lg text-primary mb-1">{t("topCategories")}</CardTitle>
      <div className="space-y-4">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4 text-start">{t("rank")}</TableHead>
              <TableHead className="py-2 px-4 text-start">{t("category")}</TableHead>
              <TableHead className="py-2 px-4 text-start">{t("sales")}</TableHead>
              <TableHead className="py-2 px-4 text-start">{t("popularity")}</TableHead>
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
      <CardTitle className="text-lg text-primary mb-1">{t("requests")}</CardTitle>
      <div className="space-y-4">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4 text-start">{t("name")}</TableHead>
              <TableHead className="py-2 px-4 text-start">{t("requestDateTime")}</TableHead>
              <TableHead className="py-2 px-4 text-start">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestsData.slice(0, 5).map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{row.name}</TableCell>
                <TableCell className="py-2 px-4">{row.requestDateTime}</TableCell>
                <TableCell className="py-2 px-4">
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleAction(row.id, "accept")}
                    >
                      {t("accept")}
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleAction(row.id, "reject")}
                    >
                      {t("reject")}
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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


const NavigationCards = ({ t }) => {
  return (
    <div className="w-full lg:w-2/5 flex flex-col sm:flex-row sm:grid-cols-2 md:grid-cols-1 gap-4">
      <Link href="/dashboard/top-orders" className="block">
        <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-6">
          <CardTitle className="text-lg text-primary mb-1">
            {t("seeTopOrders")}
          </CardTitle>
          <CardDescription>{t("seeTopOrdersDesc")}</CardDescription>
        </Card>
      </Link>
      <Link href="/dashboard/top-sales" className="block">
        <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-6">
          <CardTitle className="text-lg text-primary mb-1">
            {t("seeTopSales")}
          </CardTitle>
          <CardDescription>{t("seeTopSalesDesc")}</CardDescription>
        </Card>
      </Link>
    </div>
  );
};



const OrdersTable = ({
  t,
  coupons,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Define columns in natural LTR order
  const columns = useMemo(() => [
    { key: "userInfo", label: t("userInfo") || "User Info" },
    { key: "phone", label: t("phone") || "Phone" },
    { key: "startDate", label: t("startDate") || "Start Date" },
    { key: "endDate", label: t("endDate") || "End Date" },
    { key: "status", label: t("status") || "Status" },
    { key: "coupons", label: t("coupons") || "Coupons" },
    { key: "actions", label: t("actions") || "Actions" },
  ], [t]);

  // Reverse data for RTL display
  const displayedData = useMemo(() => 
    isRTL ? [...coupons].reverse() : coupons
  , [coupons, isRTL]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      isRTL ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
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
                      className={`px-4 py-3 font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedData.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {columns.map((column) => (
                      <TableCell 
                        key={`${order.id}-${column.key}`}
                        className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {renderTableCellContent(order, column.key, isRTL, t, formatDate)}
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
          <PaginationContent className={`w-full ${isRTL ? 'justify-center' : 'justify-center'}`}>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
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
function renderTableCellContent(order, key, isRTL, t, formatDate) {
  switch(key) {
    case "userInfo":
      return (
        <div className={`flex items-center ${'flex-row'} gap-2`}>
          <div className="relative w-9 h-10">
            <Image
              src={order.image}
              alt={order.name}
              fill
              className="rounded-[10px] object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{order.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {order.email}
            </span>
          </div>
        </div>
      );
      
    case "phone":
      return (<span style={{ 
      direction: 'ltr',
      unicodeBidi: 'isolate',
      display: 'inline-block',
      textAlign: isRTL ? 'right' : 'left'
    }}>
      {order.phone}
    </span>);
      
    case "startDate":
      return formatDate(order.startDate);
      
    case "endDate":
      return formatDate(order.endDate);
      
    case "status":
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          order.status === "active" ? "bg-green-100 text-green-800" :
          order.status === "expired" ? "bg-red-100 text-red-800" :
          "bg-yellow-100 text-yellow-800"
        }`}>
          {t(order.status)}
        </span>
      );
      
    case "coupons":
      return  isRTL ? `${order.restCoupons}/${order.totalCoupons}` : `${order.totalCoupons}/${order.restCoupons}`;
      
    case "actions":
      return (
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="text-sm text-primary underline hover:text-primary/80"
        >
          {t("viewDetails")}
        </Link>
      );
      
    default:
      return null;
  }
}


export default function AllOrdersDashboard() {
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

  const filteredOrders = useMemo(() => {
    // Ensure allOrdersData is an array
    const orders = Array.isArray(allOrdersData) ? allOrdersData : [];

    return orders
      .filter((order) => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
          (typeof order.name === "string" &&
            order.name.toLowerCase().includes(lowerSearch)) ||
          (typeof order.email === "string" &&
            order.email.toLowerCase().includes(lowerSearch)) ||
          (typeof order.phone === "string" &&
            order.phone.toLowerCase().includes(lowerSearch))
        );
      })
      .filter((order) => {
        if (["active", "expired", "pending"].includes(filterType)) {
          return (
            typeof order.status === "string" &&
            order.status.toLowerCase() === filterType.toLowerCase()
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

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE) || 1;
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
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

      {/* Section 3: Orders Table */}
      <OrdersTable
        t={t}
        coupons={currentOrders}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
