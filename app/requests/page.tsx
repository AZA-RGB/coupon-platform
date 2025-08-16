"use client";
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { fetchRequests, approveRequest, rejectRequest } from "../providers/constants";

const REQUESTS_PER_PAGE = 10;

const RequestDetailsModal = ({ request, t, open, onOpenChange }) => {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("requestDetails")}: {request.name}</DialogTitle>
          <DialogDescription>{t("requestId")}: {request.id}</DialogDescription>
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
            <p className="text-sm text-muted-foreground">{request.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("bankId")}</h4>
              <p className="text-sm text-muted-foreground">{request.bankId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("categoryId")}</h4>
              <p className="text-sm text-muted-foreground">{request.categoryId}</p>
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

// eslint-disable-next-line react/display-name
const RequestsTable = memo(
  ({ t, requests, currentPage, setCurrentPage, totalPages, handleApproveRequest, handleRejectRequest }) => {
    const locale = useLocale();
    const isRTL = locale === "ar";

    const columns = useMemo(
      () => [
        { key: "name", label: t("name") || "Name" },
        { key: "email", label: t("email") || "Email" },
        { key: "phone", label: t("phone") || "Phone" },
        { key: "createdAt", label: t("createdAt") || "Created At" },
        { key: "actions", label: t("actions") || "Actions" },
      ],
      [t],
    );

    const displayedData = useMemo(
      () => (isRTL ? [...requests].reverse() : requests),
      [requests, isRTL],
    );

    return (
      <Card className="shadow-none">
        <CardContent className="px-2">
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
                        {t("noRequestsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((request) => (
                      <TableRow
                        key={request.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${request.id}-${column.key}`}
                            className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {renderRequestTableCellContent(
                              request,
                              column.key,
                              isRTL,
                              t,
                              handleApproveRequest,
                              handleRejectRequest,
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
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.t === nextProps.t &&
      prevProps.requests === nextProps.requests &&
      prevProps.currentPage === nextProps.currentPage &&
      prevProps.totalPages === nextProps.totalPages &&
      prevProps.handleApproveRequest === nextProps.handleApproveRequest &&
      prevProps.handleRejectRequest === nextProps.handleRejectRequest
    );
  },
);

function renderRequestTableCellContent(
  request,
  key,
  isRTL,
  t,
  handleApproveRequest,
  handleRejectRequest,
) {
  const [open, setOpen] = useState(false);

  switch (key) {
    case "name":
      return <span>{request.name}</span>;
    case "email":
      return <span>{request.email}</span>;
    case "phone":
      return <span>{request.phone}</span>;
    case "createdAt":
      return (
        <span>
          {new Date(request.createdAt).toLocaleDateString(
             "en-US",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            },
          )}
        </span>
      );
    case "actions":
      return (
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="bg-green-500 cursor-pointer text-white px-1 py-1 rounded hover:bg-green-600"
              >
                {t("accept")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("confirmApproveTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("confirmApproveDesc", { name: request.name })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleApproveRequest(request.id)}>
                  {t("confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="bg-red-500 cursor-pointer text-white px-1 py-1 rounded hover:bg-red-600"
              >
                {t("reject")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("confirmRejectTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("confirmRejectDesc", { name: request.name })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRejectRequest(request.id)}>
                  {t("confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setOpen(true)}
          >
            {t("viewDetails")}
          </Button>
          <RequestDetailsModal
            request={request}
            t={t}
            open={open}
            onOpenChange={setOpen}
          />
        </div>
      );
    default:
      return null;
  }
}

export default function RequestsPage() {
  const t = useTranslations("Providers");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        setSearchQuery(inputValue);
        setCurrentPage(1);
      }
    },
    [inputValue],
  );

  const fetchRequestsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { requests, totalPages, currentPage: apiCurrentPage } = await fetchRequests(
        currentPage,
        REQUESTS_PER_PAGE,
        searchQuery,
      );
      if (!Array.isArray(requests)) {
        throw new Error("Requests data is not an array");
      }
      setRequests(requests);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
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
      setRequests([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, t]);

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
    fetchRequestsData();
  }, [fetchRequestsData]);

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>{t("requests")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
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
            </CardHeader>
                      </Card>

            <RequestsTable
              t={t}
              requests={requests}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              handleApproveRequest={handleApproveRequest}
              handleRejectRequest={handleRejectRequest}
            />
        </>
      )}
    </div>
  );
}