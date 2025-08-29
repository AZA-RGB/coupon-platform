"use client";
import { useState, useMemo, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  fetchProviderCustomers,
  fetchProviderCustomerDetails,
} from "./constants";



const CustomerDetailsModal = ({ customer, t, open, onOpenChange }) => {
  if (!customer) return null;

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const customerAge = calculateAge(customer.birthDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] p-0 bg-background border-border rounded-xl overflow-y-auto">
        <div className="relative">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-6 px-6 border-b border-border">
            <DialogHeader className="text-left">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-background/80 bg-background shadow-lg">
                    <Image
                      src={customer.image}
                      alt={customer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {customer.name}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-muted-foreground flex items-center gap-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {customer.location}
                  </DialogDescription>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {customerAge} {t('yearsOld')}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      {customer.purchasesCount} {t('purchases')}
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="px-6 py-5">
            <div className="grid gap-5">
              <div className="bg-muted/40 p-5 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2 pb-2 border-border border-b">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t("contactInformation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {t("email")}
                    </p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      {customer.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {t("phone")}
                    </p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/40 p-5 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2 pb-2 border-border border-b">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t("personalDetails")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("birthDate")}</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(customer.birthDate).toLocaleDateString()} ({customerAge} {t('yearsOld')})
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("memberSince")}</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(customer.createdAt || new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
                  {t("close")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CustomersTable = ({
  t,
  customers,
  currentPage,
  setCurrentPage,
  totalPages,
  setSelectedCustomer,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedCustomer, setLocalSelectedCustomer] = useState(null);

  const columns = useMemo(
    () => [
      { key: "userInfo", label: t("userInfo") || "User Info" },
      { key: "phone", label: t("phone") || "Phone" },
      { key: "subscribeDate", label: t("subscribeDate") || "Subscribe Date" },
      { key: "status", label: t("status") || "Status" },
      // { key: "coupons", label: t("coupons") || "Coupons" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t],
  );

  const displayedData = useMemo(
    () => (isRTL ? [...customers].reverse() : customers),
    [customers, isRTL],
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <CustomerDetailsModal
        customer={selectedCustomer}
        t={t}
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setLocalSelectedCustomer(null)}
      />
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
                        className={`px-4 py-3 font-medium ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {t("noCustomersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${customer.id}-${column.key}`}
                            className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {renderTableCellContent(
                              customer,
                              column.key,
                              isRTL,
                              t,
                              formatDate,
                              setLocalSelectedCustomer,
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
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
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className="cursor-pointer"
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </>
  );
};

function renderTableCellContent(customer, key, isRTL, t, formatDate, setSelectedCustomer) {
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
              : customer.status === "banned"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {t(`Status.${customer.status}`)}
        </span>
      );
    // case "coupons":
    //   return `${customer.totalCoupons}`;
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedCustomer(customer)}
          >
            {t("viewDetails")}
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function ProviderCustomersDashboard() {
  const t = useTranslations("Customers");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }
  };

  const fetchCustomersData = async () => {
    setIsLoading(true);
    try {
      const {
        customers,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchProviderCustomers(currentPage, searchQuery, statusFilter);
      if (!Array.isArray(customers)) {
        throw new Error("Customers data is not an array");
      }
      setCustomers(customers);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchProviderCustomersData:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(
        error.response?.status
          ? `${t("fetchErrorDesc")} (Status ${error.response.status}: ${error.response.data?.message || error.message})`
          : `${t("fetchErrorDesc")} (${error.message})`,
        {
          description: t("fetchError"),
          duration: 5000,
        },
      );
      setCustomers([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, [currentPage, searchQuery, statusFilter]);

  const currentCustomers = useMemo(() => {
    return customers.sort((a, b) => {
      if (filterType === "newest") {
        return new Date(b.subscribeDate).getTime() - new Date(a.subscribeDate).getTime();
      } else if (filterType === "oldest") {
        return new Date(a.subscribeDate).getTime() - new Date(b.subscribeDate).getTime();
      }
      return 0;
    });
  }, [customers, filterType]);

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("active"), value: "0" },
    { label: t("banned"), value: "2" },
  ];

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-4 w-full">
          </div>
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
              <div className="flex space-x-2 relative z-50">
                <div className="relative">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {t("filter")}
                  </Button> */}
                  {isFilterMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
                      {filterOptions.map((item) => (
                        <button
                          key={item.value}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            filterType === item.value || statusFilter === item.value
                              ? "bg-gray-200 dark:bg-gray-600"
                              : ""
                          }`}
                          onClick={() => {
                            if (["newest", "oldest"].includes(item.value)) {
                              setFilterType(item.value);
                              setStatusFilter("");
                            } else {
                              setStatusFilter(item.value);
                              setFilterType("");
                            }
                            setCurrentPage(1);
                            setIsFilterMenuOpen(false);
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("search")}
                    className="h-8 max-w-[200px]"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
                </div> */}
              </div>
            </CardHeader>
          </Card>
          <CustomersTable
            t={t}
            customers={currentCustomers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            setSelectedCustomer={fetchProviderCustomerDetails}
          />
        </>
      )}
    </div>
  );
}