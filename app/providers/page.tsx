"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchProviders, deleteProvider, fetchProviderDetails, topCategoriesData, requestsData } from "./constants";
import MyImage from "@/components/my-image";

const PROVIDERS_PER_PAGE = 10;

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

const ProviderDetailsModal = ({ provider, t, open, onOpenChange }) => {
  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <div className="relative w-full h-64 mt-4">
                              <MyImage src={provider.image}
              alt={provider.name} />
            
            
          </div>
          <DialogTitle>{provider.name}</DialogTitle>
          <DialogDescription>{provider.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("email")}</h4>
              <p className="text-sm text-muted-foreground">{provider.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("phone")}</h4>
              <p className="text-sm text-muted-foreground">{provider.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("location")}</h4>
            <p className="text-sm text-muted-foreground">{provider.location}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProvidersTable = ({
  t,
  providers,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedProviders,
  setSelectedProviders,
  handleDeleteSelected,
  handleSelectProvider,
  refreshProviders,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedProvider, setSelectedProvider] = useState(null);

  const columns = useMemo(
    () => [
      { key: "select", label: t("select") || "Select" },
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

  const displayedData = useMemo(
    () => (isRTL ? [...providers].reverse() : providers),
    [providers, isRTL]
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleToggleSelectAll = () => {
    const allSelected = providers.every((provider) =>
      selectedProviders.includes(provider.id),
    );
    setSelectedProviders(allSelected ? [] : providers.map((provider) => provider.id));
  };

  return (
    <>
      <ProviderDetailsModal
        provider={selectedProvider}
        t={t}
        open={!!selectedProvider}
        onOpenChange={(open) => !open && setSelectedProvider(null)}
      />
      <Card className="shadow-sm">
        <CardContent className="p-x-2">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleToggleSelectAll}
              disabled={providers.length === 0}
            >
              {t(
                selectedProviders.length === providers.length && providers.length > 0
                  ? "deselectAll"
                  : "selectAll",
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={selectedProviders.length === 0}
                >
                  {t("deleteSelected")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("confirmDeleteDesc", { count: selectedProviders.length })}
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
                        {t("noProvidersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((provider) => (
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
                              formatDate,
                              handleSelectProvider,
                              setSelectedProvider,
                              refreshProviders
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
  provider,
  key,
  isRTL,
  t,
  formatDate,
  handleSelectProvider,
  setSelectedProvider,
  refreshProviders
) {
  switch (key) {
    case "select":
      return (
        <Checkbox
          className="mx-6"
          checked={provider.isSelected}
          onCheckedChange={() => handleSelectProvider(provider.id)}
        />
      );
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
      return `${provider.totalCoupons}`;
    case "packages":
      return `${provider.totalPackages}`;
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedProvider(provider)}
          >
            {t("viewDetails")}
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function AllProvidersDashboard() {
  const t = useTranslations("Providers");
  const { locale } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSelectProvider = useCallback((id) => {
    setSelectedProviders((prev) =>
      prev.includes(id)
        ? prev.filter((providerId) => providerId !== id)
        : [...prev, id]
    );
  }, []);

  const fetchProvidersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        providers,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchProviders(currentPage, PROVIDERS_PER_PAGE);
      if (!Array.isArray(providers)) {
        throw new Error("Providers data is not an array");
      }
      setProviders(
        providers.map((provider) => ({
          ...provider,
          isSelected: selectedProviders.includes(provider.id),
        }))
      );
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchProvidersData:", {
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
        }
      );
      setProviders([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedProviders, t]);

  useEffect(() => {
    fetchProvidersData();
  }, [fetchProvidersData, currentPage]);

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    try {
      const deletePromises = selectedProviders.map((id) => deleteProvider(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Provider ID ${result.id}: ${status ? `Status ${status} - ` : ""}${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(t("deleteSuccessDesc", { count: selectedProviders.length }), {
          description: t("deleteSuccess"),
          duration: 3000,
        });
        setSelectedProviders([]);
        setCurrentPage(1);
        await fetchProvidersData();
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
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("active"), value: "active" },
    { label: t("expired"), value: "expired" },
    { label: t("pending"), value: "pending" },
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
            <TopCategoriesCard t={t} topCategoriesData={topCategoriesData} />
            <RequestsCard t={t} requestsData={requestsData} />
          </div>
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
                            setCurrentPage(1);
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
          <ProvidersTable
            t={t}
            providers={providers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedProviders={selectedProviders}
            setSelectedProviders={setSelectedProviders}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectProvider={handleSelectProvider}
            refreshProviders={fetchProvidersData}
          />
        </>
      )}
    </div>
  );
}