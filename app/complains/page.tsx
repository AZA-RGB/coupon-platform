"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import debounce from "lodash/debounce";
import { fetchComplaints, deleteComplaint } from "./constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const COMPLAINTS_PER_PAGE = 10;

const ComplaintDetailsModal = ({ complaint, t, open, onOpenChange }) => {
  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{complaint.title}</DialogTitle>
          <DialogDescription>{complaint.content}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("userId")}</h4>
              <p className="text-sm text-muted-foreground">{complaint.userId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("complainableType")}</h4>
              <p className="text-sm text-muted-foreground capitalize">{complaint.complainableType}</p>
            </div>
          </div>
          {complaint.complainable && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">{t("complainableName")}</h4>
                  <p className="text-sm text-muted-foreground">{complaint.complainable.name}</p>
                </div>
                {complaint.complainable.description && (
                  <div>
                    <h4 className="text-sm font-medium">{t("description")}</h4>
                    <p className="text-sm text-muted-foreground">{complaint.complainable.description}</p>
                  </div>
                )}
              </div>
              {complaint.complainable.price && (
                <div>
                  <h4 className="text-sm font-medium">{t("price")}</h4>
                  <p className="text-sm text-muted-foreground">{complaint.complainable.price}</p>
                </div>
              )}
              {complaint.complainable.couponCode && (
                <div>
                  <h4 className="text-sm font-medium">{t("couponCode")}</h4>
                  <p className="text-sm text-muted-foreground">{complaint.complainable.couponCode}</p>
                </div>
              )}
              {complaint.complainable.location && (
                <div>
                  <h4 className="text-sm font-medium">{t("location")}</h4>
                  <p className="text-sm text-muted-foreground">{complaint.complainable.location}</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ComplaintsTable = ({
  t,
  complaints,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedComplaints,
  setSelectedComplaints,
  handleDeleteSelected,
  handleSelectComplaint,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const columns = useMemo(
    () => [
      { key: "select", label: t("select") || "Select" },
      { key: "title", label: t("title") || "Title" },
      { key: "content", label: t("content") || "Content" },
      { key: "userId", label: t("userId") || "User ID" },
      { key: "complainableType", label: t("complainableType") || "Type" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t],
  );

  const displayedData = useMemo(
    () => (isRTL ? [...complaints].reverse() : complaints),
    [complaints, isRTL],
  );

  const handleToggleSelectAll = () => {
    const allSelected = complaints.every((complaint) =>
      selectedComplaints.includes(complaint.id),
    );
    setSelectedComplaints(allSelected ? [] : complaints.map((complaint) => complaint.id));
  };

  return (
    <>
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        t={t}
        open={!!selectedComplaint}
        onOpenChange={(open) => !open && setSelectedComplaint(null)}
      />
      
      <Card className="shadow-none">
        <CardContent className="p-x-2">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleToggleSelectAll}
              disabled={complaints.length === 0}
            >
              {t(
                selectedComplaints.length === complaints.length && complaints.length > 0
                  ? "deselectAll"
                  : "selectAll",
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={selectedComplaints.length === 0}
                >
                  {t("deleteSelected")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("confirmDeleteDesc", { count: selectedComplaints.length })}
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
                        {t("noComplaintsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((complaint) => (
                      <TableRow
                        key={complaint.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${complaint.id}-${column.key}`}
                            className={`px-4 py-3 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {renderTableCellContent(
                              complaint,
                              column.key,
                              isRTL,
                              t,
                              handleSelectComplaint,
                              setSelectedComplaint,
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
  complaint,
  key,
  isRTL,
  t,
  handleSelectComplaint,
  setSelectedComplaint,
) {
  switch (key) {
    case "select":
      return (
        <Checkbox
          className="mx-6"
          checked={complaint.isSelected}
          onCheckedChange={() => handleSelectComplaint(complaint.id)}
        />
      );
    case "title":
      return <span className="font-medium">{complaint.title}</span>;
    case "content":
      return <span>{complaint.content}</span>;
    case "userId":
      return <span>{complaint.userId}</span>;
    case "complainableType":
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            complaint.complainableType === "provider"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : complaint.complainableType === "package"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          }`}
        >
          {t(complaint.complainableType)}
        </span>
      );
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedComplaint(complaint)}
          >
            {t("viewDetails")}
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function ComplaintsAllPage() {
  const t = useTranslations("Complaints");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    [],
  );

  const handleSelectComplaint = useCallback((id) => {
    setSelectedComplaints((prev) =>
      prev.includes(id)
        ? prev.filter((complaintId) => complaintId !== id)
        : [...prev, id],
    );
  }, []);

  const fetchComplaintsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        complaints,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchComplaints(currentPage, COMPLAINTS_PER_PAGE);
      console.log("Fetched complaints:", complaints, "Total pages:", totalPages, "Current page:", apiCurrentPage);
      if (!Array.isArray(complaints)) {
        throw new Error("Complaints data is not an array");
      }
      setComplaints(
        complaints.map((complaint) => ({
          ...complaint,
          isSelected: selectedComplaints.includes(complaint.id),
        })),
      );
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchComplaintsData:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      const errorMessage = error.response?.status
        ? `${t("fetchErrorDesc")} (Status ${error.response.status}: ${error.response.data?.message || error.message})`
        : `${t("fetchErrorDesc")} (${error.message})`;
      toast.error(errorMessage, {
        description: t("fetchError"),
        duration: 5000,
      });
      setComplaints([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedComplaints, t]);

  useEffect(() => {
    console.log("Fetching complaints for page:", currentPage, "Search:", searchTerm, "Filter:", filterType);
    fetchComplaintsData();
  }, [fetchComplaintsData, currentPage, searchTerm, filterType]);

  const handleDeleteSelected = async () => {
    console.log("Selected Complaints:", selectedComplaints);
    setIsLoading(true);
    try {
      const deletePromises = selectedComplaints.map((id) => deleteComplaint(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        console.error("Failed to delete some complaints:", failedDeletions);
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Complaint ID ${result.id}: ${status ? `Status ${status} - ` : ""}${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(t("deleteSuccessDesc", { count: selectedComplaints.length }), {
          description: t("deleteSuccess"),
          duration: 3000,
        });
        setSelectedComplaints([]);
        setCurrentPage(1);
        await fetchComplaintsData();
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

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <Card className="shadow-none">
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
                    className="cursor-pointer text-muted-foreground"
                    onClick={() => {
                      const el = document.getElementById("filter-menu");
                      if (el) el.classList.toggle("hidden");
                    }}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {t("filter")}
                  </Button>
                  <div
                    id="filter-menu"
                    className="cursor-pointer absolute right-0 z-10 mt-2 w-40 bg-secondary border rounded shadow hidden"
                  >
                    {[
                      { label: t("provider"), value: "provider" },
                      { label: t("package"), value: "package" },
                      { label: t("coupon"), value: "coupon" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-200 ${
                          filterType === item.value ? "bg-gray-200" : ""
                        }`}
                        onClick={() => {
                          setFilterType(item.value);
                          setCurrentPage(1);
                          const el = document.getElementById("filter-menu");
                          if (el) el.classList.add("hidden");
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
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
          <ComplaintsTable
            t={t}
            complaints={complaints}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedComplaints={selectedComplaints}
            setSelectedComplaints={setSelectedComplaints}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectComplaint={handleSelectComplaint}
          />
        </>
      )}
    </div>
  );
}