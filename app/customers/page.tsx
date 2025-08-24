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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  fetchCustomers,
  deleteCustomer,
  fetchCustomerDetails,
  fetchCouponStats,
  blockCustomer,
} from "./constants";
import ReportGenerator from "@/components/reportGenerator";

const SummaryCards = ({ t, summaries }) => {
  return (
    <Card className="w-full lg:w-3/4 p-4 hidden md:flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {summaries.map((summary, index) => (
          <div key={index} className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h2>{t(summary.title)}</h2>
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

const MobileSummaryCards = ({ t, summaries }) => {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {summaries.map((summary, index) => (
        <Card key={index} className="w-full p-4 flex flex-col justify-between">
          <div>
            <h2>{t(summary.title)}</h2>
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
      <a href="/top-customers" className="block h-full">
        <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-4">
          <CardTitle className="text-lg text-primary mb-1">
            {t("seeTopCustomers")}
          </CardTitle>
          <CardDescription>{t("seeTopCustomersDesc")}</CardDescription>
        </Card>
      </a>
    </div>
  );
};

const CustomerDetailsModal = ({ customer, t, open, onOpenChange }) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <div className="relative w-full h-64 mt-4">
            <Image
              src={customer.image}
              alt={customer.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <DialogTitle>{customer.name}</DialogTitle>
          <DialogDescription>{customer.location}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("email")}</h4>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("phone")}</h4>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("birthDate")}</h4>
            <p className="text-sm text-muted-foreground">
              {new Date(customer.birthDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("purchasesCount")}</h4>
            <p className="text-sm text-muted-foreground">
              {customer.purchasesCount}
            </p>
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
  selectedCustomers,
  setSelectedCustomers,
  handleDeleteSelected,
  handleSelectCustomer,
  refreshCustomers,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const columns = useMemo(
    () => [
      { key: "select", label: t("select") || "Select" },
      { key: "userInfo", label: t("userInfo") || "User Info" },
      { key: "phone", label: t("phone") || "Phone" },
      { key: "subscribeDate", label: t("subscribeDate") || "Subscribe Date" },
      { key: "status", label: t("status") || "Status" },
      { key: "coupons", label: t("coupons") || "Coupons" },
      { key: "banned", label: t("banned") || "Banned" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t],
  );

  const displayedData = useMemo(
    () => (isRTL ? [...customers].reverse() : customers),
    [customers, isRTL],
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleToggleSelectAll = () => {
    const allSelected = customers.every((customer) =>
      selectedCustomers.includes(customer.id),
    );
    setSelectedCustomers(
      allSelected ? [] : customers.map((customer) => customer.id),
    );
  };

  const handleBlockCustomer = async (id, block) => {
    try {
      const { success, error } = await blockCustomer(id, block);
      if (success) {
        toast.success(t(block ? "banSuccess" : "unBanSuccess"), {
          duration: 3000,
        });
        await refreshCustomers();
      } else {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        toast.error(
          `${t("blockErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
          {
            description: t("blockError"),
            duration: 7000,
          },
        );
      }
    } catch (error) {
      console.error("Error during block/unblock:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      toast.error(
        `${t("blockErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
        {
          description: t("blockError"),
          duration: 7000,
        },
      );
    }
  };

  return (
    <>
      <CustomerDetailsModal
        customer={selectedCustomer}
        t={t}
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      />
      <Card className="shadow-sm">
        <CardContent className="p-x-2">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleToggleSelectAll}
              disabled={customers.length === 0}
              className="cursor-pointer"
            >
              {t(
                selectedCustomers.length === customers.length &&
                  customers.length > 0
                  ? "deselectAll"
                  : "selectAll",
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={selectedCustomers.length === 0}
                >
                  {t("deleteSelected")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("confirmDeleteDesc", {
                      count: selectedCustomers.length,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSelected}>
                    {t("confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
                            className={`px-4 py-3 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {renderTableCellContent(
                              customer,
                              column.key,
                              isRTL,
                              t,
                              formatDate,
                              handleSelectCustomer,
                              setSelectedCustomer,
                              refreshCustomers,
                              selectedCustomers,
                              handleBlockCustomer,
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
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
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
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
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

function renderTableCellContent(
  customer,
  key,
  isRTL,
  t,
  formatDate,
  handleSelectCustomer,
  setSelectedCustomer,
  refreshCustomers,
  selectedCustomers,
  handleBlockCustomer,
) {
  switch (key) {
    case "select":
      return (
        <Checkbox
          className="mx-6"
          checked={selectedCustomers.includes(customer.id)}
          onCheckedChange={() => handleSelectCustomer(customer.id)}
        />
      );
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
    case "coupons":
      return `${customer.totalCoupons}`;
    case "banned":
      return (
        <Button
          variant="default"
          size="sm"
          className={`cursor-pointer ${
            customer.status === "active"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={() =>
            handleBlockCustomer(customer.id, customer.status === "active")
          }
        >
          {t(customer.status === "active" ? "ban" : "unBan")}
        </Button>
      );
    case "actions":
      return (
        <div className="flex gap-2">
          <ReportGenerator
            variant="link"
            object={customer}
            object_type="customers"
            key={customer.id}
          />
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

export default function AllCustomersDashboard() {
  const t = useTranslations("Customers");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [summaryData, setSummaryData] = useState([
    { title: "totalCustomers", value: "0", change: "+0%" },
    { title: "newCustomers", value: "0", change: "+0%" },
    { title: "activeCustomers", value: "0", change: "+0%" },
  ]);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }
  };

  const handleSelectCustomer = (id) => {
    setSelectedCustomers((prev) =>
      prev.includes(id)
        ? prev.filter((customerId) => customerId !== id)
        : [...prev, id],
    );
  };

  const fetchCustomersData = async () => {
    setIsLoading(true);
    try {
      const {
        customers,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchCustomers(currentPage, searchQuery, statusFilter);
      if (!Array.isArray(customers)) {
        throw new Error("Customers data is not an array");
      }
      setCustomers(customers);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchCustomersData:", {
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

  const fetchSummaryData = async () => {
    try {
      const stats = await fetchCouponStats();
      setSummaryData(stats);
    } catch (error) {
      console.error("Error fetching summary data:", error);
      toast.error(t("fetchErrorDesc"), {
        description: t("fetchError"),
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchCustomersData();
    fetchSummaryData();
  }, [currentPage, searchQuery, statusFilter]);

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    try {
      const deletePromises = selectedCustomers.map((id) => deleteCustomer(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Customer ID ${result.id}: ${status ? `Status ${status} - ` : ""}${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(
          t("deleteSuccessDesc", { count: selectedCustomers.length }),
          {
            description: t("deleteSuccess"),
            duration: 3000,
          },
        );
        setSelectedCustomers([]);
        setCurrentPage(1);
        await fetchCustomersData();
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      toast.error(
        `${t("deleteErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
        {
          description: t("deleteError"),
          duration: 7000,
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentCustomers = useMemo(() => {
    return customers.sort((a, b) => {
      if (filterType === "newest") {
        return (
          new Date(b.subscribeDate).getTime() -
          new Date(a.subscribeDate).getTime()
        );
      } else if (filterType === "oldest") {
        return (
          new Date(a.subscribeDate).getTime() -
          new Date(b.subscribeDate).getTime()
        );
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
            <SummaryCards t={t} summaries={summaryData} />
            <MobileSummaryCards t={t} summaries={summaryData} />
            <NavigationCards t={t} />
          </div>
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
              <div className="flex space-x-2 relative z-50">
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
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
                      {filterOptions.map((item) => (
                        <button
                          key={item.value}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            filterType === item.value ||
                            statusFilter === item.value
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
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("search")}
                    className="h-8 max-w-[200px]"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
          </Card>
          <CustomersTable
            t={t}
            customers={currentCustomers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedCustomers={selectedCustomers}
            setSelectedCustomers={setSelectedCustomers}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectCustomer={handleSelectCustomer}
            refreshCustomers={fetchCustomersData}
          />
        </>
      )}
    </div>
  );
}
