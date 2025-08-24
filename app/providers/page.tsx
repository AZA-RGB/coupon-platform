"use client";
import { useState, useMemo, useEffect, useCallback, memo } from "react";
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
import { CalendarIcon, Filter, Search } from "lucide-react";
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchProviders,
  deleteProvider,
  fetchTopCategories,
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
} from "./constants";
import MyImage from "@/components/my-image";
import Router from "next/router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ReportGenerator from "@/components/reportGenerator";

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

const RequestsCard = ({
  t,
  requestsData,
  handleApproveRequest,
  handleRejectRequest,
}) => {
  return (
    <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
      <CardTitle className="mb-1 flex justify-between">
        <span className="text-lg text-primary">{t("requests")}</span>
        <Link href="/requests" className="text-sm hover:text-foreground/80">
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
            {requestsData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("noRequestsFound")}
                </TableCell>
              </TableRow>
            ) : (
              requestsData.slice(0, 5).map((row, index) => (
                <TableRow key={index} className="hover:bg-secondary">
                  <TableCell className="py-2 px-4">{row.name}</TableCell>
                  <TableCell className="py-2 px-4">
                    {row.requestDateTime}
                  </TableCell>
                  <TableCell className="py-2 px-4">
                    <div className="flex gap-2 justify-center">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-green-500 cursor-pointer text-white px-1 py-1 rounded hover:bg-green-600">
                            {t("accept")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("confirmApproveTitle")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("confirmApproveDesc", { name: row.name })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleApproveRequest(row.id)}
                            >
                              {t("confirm")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-red-500 cursor-pointer text-white px-1 py-1 rounded hover:bg-red-600">
                            {t("reject")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("confirmRejectTitle")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("confirmRejectDesc", { name: row.name })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRejectRequest(row.id)}
                            >
                              {t("confirm")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

const RequestDetailsModal = ({ request, t }) => {
  if (!request) return null;

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("requestDetails")}: {request.name}
          </DialogTitle>
          <DialogDescription>
            {t("requestId")}: {request.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("userId")}</h4>
              <p className="text-sm text-muted-foreground">{request.userId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("email")}</h4>
              <p className="text-sm text-muted-foreground">{request.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("phone")}</h4>
              <p className="text-sm text-muted-foreground">{request.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("createdAt")}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("location")}</h4>
            <p className="text-sm text-muted-foreground">{request.location}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("description")}</h4>
            <p className="text-sm text-muted-foreground">
              {request.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("bankId")}</h4>
              <p className="text-sm text-muted-foreground">{request.bankId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("categoryId")}</h4>
              <p className="text-sm text-muted-foreground">
                {request.categoryId}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("secretKey")}</h4>
            <p className="text-sm text-muted-foreground">{request.secretKey}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProviderDetailsModal = ({ provider, t, open, onOpenChange }) => {
  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative w-full h-64 mt-4">
            <MyImage src={provider.image} alt={provider.name} />
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

// eslint-disable-next-line react/display-name
const ProvidersTable = memo(
  ({
    t,
    providers,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedProviders,
    setSelectedProviders,
    handleDeleteSelected,
    handleSelectProvider,
    setProviders,
    refreshProviders,
  }) => {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const columns = useMemo(
      () => [
        { key: "select", label: t("select") || "Select" },
        { key: "userInfo", label: t("userInfo") || "User Info" },
        { key: "phone", label: t("phone") || "Phone" },
        { key: "requestDate", label: t("requestDate") || "Request Date" },
        { key: "status", label: t("status") || "Status" },
        { key: "coupons", label: t("coupons") || "Coupons" },
        { key: "packages", label: t("packages") || "Packages" },
        { key: "actions", label: t("actions") || "Actions" },
      ],
      [t],
    );

    const displayedData = useMemo(
      () => (isRTL ? [...providers].reverse() : providers),
      [providers, isRTL],
    );

    const handleToggleSelectAll = useCallback(() => {
      const allSelected = providers.every((provider) =>
        selectedProviders.includes(provider.id),
      );
      setSelectedProviders(
        allSelected ? [] : providers.map((provider) => provider.id),
      );
    }, [providers, selectedProviders, setSelectedProviders]);

    return (
      <>
        <ProviderDetailsModal
          provider={selectedProvider}
          t={t}
          open={!!selectedProvider}
          onOpenChange={(open) => !open && setSelectedProvider(null)}
        />

        <RequestDetailsModal
          request={selectedRequest}
          t={t}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
        <Card className="shadow-none">
          <CardContent className="p-x-2">
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                onClick={handleToggleSelectAll}
                disabled={providers.length === 0}
                className="cursor-pointer"
              >
                {t(
                  selectedProviders.length === providers.length &&
                    providers.length > 0
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
                    <AlertDialogTitle>
                      {t("confirmDeleteTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("confirmDeleteDesc", {
                        count: selectedProviders.length,
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
                              {RenderTableCellContent(
                                provider,
                                column.key,
                                isRTL,
                                t,
                                handleSelectProvider,
                                setSelectedProvider,
                                selectedProviders,
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
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
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
  },
);

function RenderTableCellContent(
  provider,
  key,
  isRTL,
  t,
  handleSelectProvider,
  setSelectedProvider,
  selectedProviders,
) {
  const statusStyles = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  switch (key) {
    case "select":
      return (
        <Checkbox
          className="mx-6"
          checked={selectedProviders.includes(provider.id)}
          onCheckedChange={() => handleSelectProvider(provider.id)}
        />
      );
    case "userInfo":
      return (
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src={provider.image}
              alt={provider.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{provider.name}</p>
            <p className="text-sm text-muted-foreground">{provider.email}</p>
          </div>
        </div>
      );
    case "phone":
      return <span>{provider.phone}</span>;
    case "requestDate":
      return (
        <span>
          {new Date(provider.requestDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      );
    case "status":
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${statusStyles[provider.status] || statusStyles.pending}`}
        >
          {t(provider.status)}
        </span>
      );
    case "coupons":
      return <span>{provider.totalCoupons}</span>;
    case "packages":
      return <span>{provider.totalPackages}</span>;
    case "actions":
      return (
        <div className="flex gap-2">
          <ReportGenerator
            variant="link"
            object={provider}
            object_type="providers"
            key={provider.id}
          />

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

export default function AllProvidersPage() {
  const t = useTranslations("Providers");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [topCategoriesData, setTopCategoriesData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);

  const handleSearchKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        setSearchQuery(inputValue);
        setCurrentPage(1);
      }
    },
    [inputValue],
  );

  const handleSelectProvider = useCallback((id) => {
    setSelectedProviders((prev) =>
      prev.includes(id)
        ? prev.filter((providerId) => providerId !== id)
        : [...prev, id],
    );
  }, []);

  const fetchProvidersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        providers,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchProviders(
        currentPage,
        PROVIDERS_PER_PAGE,
        searchQuery,
        statusFilter,
      );
      if (!Array.isArray(providers)) {
        throw new Error("Providers data is not an array");
      }
      setProviders(providers);
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
        },
      );
      setProviders([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, t]);

  const fetchTopCategoriesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTopCategories();
      setTopCategoriesData(data);
    } catch (error) {
      console.error("Error in fetchTopCategoriesData:", {
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
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const fetchRequestsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { requests } = await fetchPendingRequests();
      if (!Array.isArray(requests)) {
        throw new Error("Requests data is not an array");
      }
      setRequestsData(requests);
    } catch (error) {
      console.error("Error in fetchRequestsData:", {
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
      setRequestsData([]);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const handleApproveRequest = useCallback(
    async (requestId) => {
      try {
        const { success, error } = await approveRequest(requestId);
        if (success) {
          toast.success(t("approveSuccess", { id: requestId }), {
            duration: 3000,
          });
          await fetchRequestsData();
        } else {
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          toast.error(
            `${t("approveErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
            {
              description: t("approveError"),
              duration: 7000,
            },
          );
        }
      } catch (error) {
        console.error("Error during approval:", error);
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        toast.error(
          `${t("approveErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
          {
            description: t("approveError"),
            duration: 7000,
          },
        );
      }
    },
    [t, fetchRequestsData],
  );

  const handleRejectRequest = useCallback(
    async (requestId) => {
      try {
        const { success, error } = await rejectRequest(requestId);
        if (success) {
          toast.success(t("rejectSuccess", { id: requestId }), {
            duration: 3000,
          });
          await fetchRequestsData();
        } else {
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          toast.error(
            `${t("rejectErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
            {
              description: t("rejectError"),
              duration: 7000,
            },
          );
        }
      } catch (error) {
        console.error("Error during rejection:", error);
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        toast.error(
          `${t("rejectErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
          {
            description: t("rejectError"),
            duration: 7000,
          },
        );
      }
    },
    [t, fetchRequestsData],
  );

  useEffect(() => {
    fetchProvidersData();
    fetchTopCategoriesData();
    fetchRequestsData();
  }, [fetchProvidersData, fetchTopCategoriesData, fetchRequestsData]);

  const handleDeleteSelected = useCallback(async () => {
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
        toast.success(
          t("deleteSuccessDesc", { count: selectedProviders.length }),
          {
            description: t("deleteSuccess"),
            duration: 3000,
          },
        );
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
        },
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedProviders, t, fetchProvidersData]);

  const currentProviders = useMemo(() => {
    return providers.sort((a, b) => {
      if (filterType === "newest") {
        return (
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        );
      } else if (filterType === "oldest") {
        return (
          new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
        );
      }
      return 0;
    });
  }, [providers, filterType]);

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("active"), value: "0" },
    { label: t("expired"), value: "1" },
    { label: t("pending"), value: "2" },
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
            <RequestsCard
              t={t}
              requestsData={requestsData}
              handleApproveRequest={handleApproveRequest}
              handleRejectRequest={handleRejectRequest}
            />
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
          <ProvidersTable
            t={t}
            providers={currentProviders}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedProviders={selectedProviders}
            setSelectedProviders={setSelectedProviders}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectProvider={handleSelectProvider}
            setProviders={setProviders}
            refreshProviders={fetchProvidersData}
          />
        </>
      )}
    </div>
  );
}
