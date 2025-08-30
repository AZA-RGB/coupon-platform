"use client";
import { useState, useEffect, useMemo } from "react";
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
import { fetchPackages, deletePackage } from "./constants";
import MyImage from "@/components/my-image";
import AddTypeDialog from "@/components/AddType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddPackageDialog from "@/components/AddPackage";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import axios from "axios";
import ReportGenerator from "@/components/reportGenerator";

const PACKAGES_PER_PAGE = 10;

const editFormSchema = z.object({
  title: z.string().min(1, { message: "titleRequired" }),
  description: z.string().min(1, { message: "descriptionRequired" }),
  from_date: z.string().min(1, { message: "startDateRequired" }),
  to_date: z.string().min(1, { message: "endDateRequired" }),
  file: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "invalidFile",
    }),
});

const EditPackageDialog = ({ pkg, refreshPackages, t }) => {
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: pkg?.title || "",
      description: pkg?.description || "",
      from_date: pkg?.fromDate
        ? new Date(pkg.fromDate).toISOString().split("T")[0]
        : "",
      to_date: pkg?.toDate
        ? new Date(pkg.toDate).toISOString().split("T")[0]
        : "",
      file: null,
    },
  });

  async function onSubmit(values: z.infer<typeof editFormSchema>) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("from_date", values.from_date);
      formData.append("to_date", values.to_date);
      if (values.file) {
        formData.append("file", values.file);
      }

      await axios.put(
        `http://164.92.67.78:3002/api/packages/${pkg.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success(t("editSuccessDesc"), {
        description: t("editSuccess"),
        duration: 3000,
      });
      refreshPackages();
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `${t("editErrorDesc")}: ${
              error.response.data.message || t("editError")
            }`,
            { duration: 7000 },
          );
        } else if (error.request) {
          toast.error(t("networkError"), { duration: 7000 });
        } else {
          toast.error(t("requestError"), { duration: 7000 });
        }
      } else {
        toast.error(t("unexpectedError"), { duration: 7000 });
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-primary underline hover:text-primary/80 p-0 h-auto"
        >
          {t("editPackage")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editPackage")}</DialogTitle>
          <DialogDescription>{t("editPackageDesc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("titlePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("descriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("startDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("endDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("file")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogTrigger>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("updatePackage")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const PackageDetailsModal = ({ pkg, t, open, onOpenChange }) => {
  if (!pkg) return null;

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect system dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const textMutedColor = isDarkMode ? "text-gray-400" : "text-gray-600";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[650px] max-h-[85vh] flex flex-col rounded-xl ${bgColor} overflow-y-auto`}>
        {/* Header + Image */}
        <div className="relative flex-shrink-0">
          <div className="w-full h-56 relative overflow-hidden">
            <MyImage 
              src={pkg.image} 
              alt={pkg.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 left-6">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg border-2 border-background">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="px-6 pt-8 pb-6  flex-1">
          <DialogHeader>
            <DialogTitle className={`text-2xl font-bold ${textColor}`}>{pkg.title}</DialogTitle>
            <DialogDescription className={`text-base mt-2 ${textMutedColor}`}>{pkg.description}</DialogDescription>
          </DialogHeader>

          {/* Details Grid */}
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-1 flex items-center gap-1 ${textMutedColor}`}>{t("provider")}</h4>
                <p className={`text-sm font-medium ${textColor}`}>{pkg.provider}</p>
              </div>
              <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-1 flex items-center gap-1 ${textMutedColor}`}>{t("status")}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pkg.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : pkg.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {t(pkg.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-1 flex items-center gap-1 ${textMutedColor}`}>{t("startDate")}</h4>
                <p className={`text-sm font-medium ${textColor}`}>{new Date(pkg.fromDate).toLocaleDateString()}</p>
              </div>
              <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}>
                <h4 className={`text-sm font-medium mb-1 flex items-center gap-1 ${textMutedColor}`}>{t("endDate")}</h4>
                <p className={`text-sm font-medium ${textColor}`}>{new Date(pkg.toDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}>
              <h4 className={`text-sm font-medium mb-1 flex items-center gap-1 ${textMutedColor}`}>{t("coupons")}</h4>
              <p className={`text-2xl font-bold mt-1 ${textColor}`}>{pkg.couponsCount}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>{t("close")}</Button>
            <Button className="bg-primary hover:bg-primary/90">{t("viewDetails")}</Button>
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
  refreshPackages,
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
    return new Date(date).toLocaleDateString("en-US", {
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
              className="cursor-pointer"
            >
              {t(
                selectedPackages.length === packages.length &&
                  packages.length > 0
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
                              setSelectedPackage,
                              refreshPackages,
                              selectedPackages,
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
              className={`w-full ${
                isRTL ? "justify-center" : "justify-center"
              }`}
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
  setSelectedPackage,
  refreshPackages,
  selectedPackages,
) {
  switch (key) {
    case "select":
      return (
        <Checkbox
          className="mx-6"
          checked={selectedPackages.includes(pkg.id)}
          onCheckedChange={() => handleSelectPackage(pkg.id)}
        />
      );
    case "image":
      return (
        <div className="relative w-9 h-10 cursor-pointer">
          <MyImage src={pkg.image} alt={pkg.title} />
        </div>
      );
    case "title":
      return (
        <span className="font-medium">
          {pkg.title.length > 15 ? pkg.title.slice(0, 15) + "..." : pkg.title}
        </span>
      );
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
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedPackage(pkg)}
          >
            {t("viewDetails")}
          </Button>
          {/* <EditPackageDialog
            pkg={pkg}
            refreshPackages={refreshPackages}
            t={t}
          /> */}
          <ReportGenerator
            variant="link"
            object={pkg}
            object_type="packages"
            key={pkg.id}
          />
        </div>
      );
    default:
      return null;
  }
}

export default function PackagesAllPage() {
  const t = useTranslations("Packages");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }
  };

  const handleSelectPackage = (id) => {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((pkgId) => pkgId !== id) : [...prev, id],
    );
  };

  const fetchPackagesData = async () => {
    setIsLoading(true);
    try {
      const {
        packages,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchPackages(currentPage, searchQuery, statusFilter);
      if (!Array.isArray(packages)) {
        throw new Error("Packages data is not an array");
      }
      setPackages(packages);
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
        ? `${t("fetchErrorDesc")} (Status ${error.response.status}: ${
            error.response.data?.message || error.message
          })`
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
  };

  useEffect(() => {
    fetchPackagesData();
  }, [currentPage, searchQuery, statusFilter]);

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    try {
      const deletePromises = selectedPackages.map((id) => deletePackage(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Package ID ${result.id}: ${
            status ? `Status ${status} - ` : ""
          }${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(
          t("deleteSuccessDesc", { count: selectedPackages.length }),
          {
            description: t("deleteSuccess"),
            duration: 3000,
          },
        );
        setSelectedPackages([]);
        setCurrentPage(1);
        await fetchPackagesData();
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      toast.error(
        `${t("deleteErrorDesc")} ${
          status ? `(Status ${status})` : ""
        }: ${message}`,
        {
          description: t("deleteError"),
          duration: 7000,
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentPackages = useMemo(() => {
    return packages.sort((a, b) => {
      if (filterType === "newest") {
        return new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime();
      } else if (filterType === "oldest") {
        return new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime();
      }
      return 0;
    });
  }, [packages, filterType]);

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
          <Card className="shadow-none">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
              <div className="flex space-x-2 relative z-50">
                <AddPackageDialog refreshPackages={fetchPackagesData} />
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
          <PackagesTable
            t={t}
            packages={currentPackages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectPackage={handleSelectPackage}
            refreshPackages={fetchPackagesData}
          />
        </>
      )}
    </div>
  );
}
