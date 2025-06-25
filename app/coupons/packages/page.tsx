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
import { Filter, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import debounce from "lodash/debounce";
import { fetchPackages, deletePackage } from "./constants";
import MyImage from "@/components/my-image";
import AddTypeDialog from "@/components/AddType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PACKAGES_PER_PAGE = 10;



const PackageDetailsModal = ({ pkg, t, open, onOpenChange }) => {
  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <div className="relative w-full h-64 mt-4">
            <MyImage
              src={pkg.image}
              alt={pkg.title}
            />
          </div>
          <DialogTitle>{pkg.title}</DialogTitle>
          <DialogDescription>{pkg.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("provider")}</h4>
              <p className="text-sm text-muted-foreground">{pkg.provider}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("status")}</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {t(pkg.status)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("startDate")}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(pkg.fromDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("endDate")}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(pkg.toDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">{t("coupons")}</h4>
            <p className="text-sm text-muted-foreground">{pkg.couponsCount}</p>
          </div>
          
        
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PackagesTable = ({
  t,
  packages,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedPackages,
  setSelectedPackages,
  handleDeleteSelected,
  handleSelectPackage,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedPackage, setSelectedPackage] = useState(null);

  const columns = useMemo(
    () => [
      { key: "select", label: t("select") || "Select" },
      { key: "image", label: t("image") || "Image" },
      { key: "title", label: t("title") || "Title" },
      { key: "provider", label: t("provider") || "Provider" },
      { key: "dateRange", label: t("dateRange") || "Date Range" },
      { key: "status", label: t("status") || "Status" },
      { key: "coupons", label: t("coupons") || "Coupons" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t],
  );

  const displayedData = useMemo(
    () => (isRTL ? [...packages].reverse() : packages),
    [packages, isRTL],
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleToggleSelectAll = () => {
    const allSelected = packages.every((pkg) =>
      selectedPackages.includes(pkg.id),
    );
    setSelectedPackages(allSelected ? [] : packages.map((pkg) => pkg.id));
  };

  return (
    <>
   
      
      <PackageDetailsModal
        pkg={selectedPackage}
        t={t}
        open={!!selectedPackage}
        onOpenChange={(open) => !open && setSelectedPackage(null)}
      />
      
      <Card className="shadow-none">
        <CardContent className="p-x-2">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleToggleSelectAll}
              disabled={packages.length === 0}
            >
              {t(
                selectedPackages.length === packages.length && packages.length > 0
                  ? "deselectAll"
                  : "selectAll",
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={selectedPackages.length === 0}
                >
                  {t("deleteSelected")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("confirmDeleteDesc", { count: selectedPackages.length })}
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
                        {t("noPackagesFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((pkg) => (
                      <TableRow
                        key={pkg.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${pkg.id}-${column.key}`}
                            className={`px-4 py-3 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {renderTableCellContent(
                              pkg,
                              column.key,
                              isRTL,
                              t,
                              formatDate,
                              handleSelectPackage,
                              setSelectedPackage
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
  pkg,
  key,
  isRTL,
  t,
  formatDate,
  handleSelectPackage,
  setSelectedPackage
) {
  switch (key) {
    case "select":
      return (
        <Checkbox
        className="mx-6"
          checked={pkg.isSelected}
          onCheckedChange={() => handleSelectPackage(pkg.id)}
        />
      );
    case "image":
      return (
        <div 
          className="relative w-9 h-10 cursor-pointer"
        >
          <MyImage
            src={pkg.image}
            alt={pkg.title}
          />
        </div>
      );
    case "title":
      return <span className="font-medium">{pkg.title}</span>;
    case "provider":
      return <span>{pkg.provider}</span>;
    case "dateRange":
      return (
        <span>
          {formatDate(pkg.fromDate)} - {formatDate(pkg.toDate)}
        </span>
      );
    case "status":
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            pkg.status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : pkg.status === "expired"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {t(pkg.status)}
        </span>
      );
    case "coupons":
      return <span>{pkg.couponsCount}</span>;
    case "actions":
      return (
        <Button
          variant="link"
          className="text-primary underline hover:text-primary/80 p-0 h-auto"
          onClick={() => setSelectedPackage(pkg)}
        >
          {t("viewDetails")}
        </Button>
      );
    default:
      return null;
  }
}

export default function PackagesAllPage() {
  const t = useTranslations("Packages");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [packages, setPackages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to page 1 on search
    }, 300),
    [],
  );

  const handleSelectPackage = useCallback((id) => {
    setSelectedPackages((prev) =>
      prev.includes(id)
        ? prev.filter((pkgId) => pkgId !== id)
        : [...prev, id],
    );
  }, []);

  const fetchPackagesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        packages,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchPackages(currentPage, PACKAGES_PER_PAGE, searchTerm, filterType);
      console.log("Fetched packages:", packages, "Total pages:", totalPages, "Current page:", apiCurrentPage);
      if (!Array.isArray(packages)) {
        throw new Error("Packages data is not an array");
      }
      setPackages(
        packages.map((pkg) => ({
          ...pkg,
          isSelected: selectedPackages.includes(pkg.id),
        })),
      );
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchPackagesData:", {
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
      setPackages([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterType, selectedPackages, t]);

  useEffect(() => {
    console.log("Fetching packages for page:", currentPage, "Search:", searchTerm, "Filter:", filterType);
    fetchPackagesData();
  }, [fetchPackagesData, currentPage, searchTerm, filterType]);

  const handleDeleteSelected = async () => {
    console.log("Selected Packages:", selectedPackages);
    setIsLoading(true);
    try {
      const deletePromises = selectedPackages.map((id) => deletePackage(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        console.error("Failed to delete some packages:", failedDeletions);
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Package ID ${result.id}: ${status ? `Status ${status} - ` : ""}${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(t("deleteSuccessDesc", { count: selectedPackages.length }), {
          description: t("deleteSuccess"),
          duration: 3000,
        });
        setSelectedPackages([]);
        setCurrentPage(1);
        await fetchPackagesData();
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
                <AddTypeDialog refreshTypes={fetchPackagesData} />
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
                      { label: t("newest"), value: "newest" },
                      { label: t("oldest"), value: "oldest" },
                      { label: t("active"), value: "active" },
                      { label: t("expired"), value: "expired" },
                      { label: t("pending"), value: "pending" },
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
          <PackagesTable
            t={t}
            packages={packages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectPackage={handleSelectPackage}
          />
        </>
      )}
    </div>
  );
}