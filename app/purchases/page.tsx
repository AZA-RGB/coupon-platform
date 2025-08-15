"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
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
import { fetchPurchases, deletePurchase } from "./constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PURCHASES_PER_PAGE = 10;

const PurchaseDetailsModal = ({ purchase, t, open, onOpenChange }) => {
  if (!purchase) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("purchaseDetails")}</DialogTitle>
          <DialogDescription>{t("purchaseId")}: {purchase.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("customerId")}</h4>
              <p className="text-sm text-muted-foreground">{purchase.customerId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("providerId")}</h4>
              <p className="text-sm text-muted-foreground">{purchase.providerId}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("purchaseType")}</h4>
              <p className="text-sm text-muted-foreground">{purchase.purchaseType}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("date")}</h4>
              <p className="text-sm text-muted-foreground">{new Date(purchase.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("paidAmount")}</h4>
            <p className="text-sm text-muted-foreground">{purchase.paidAmount}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("hashKey")}</h4>
            <p className="text-sm text-muted-foreground">{purchase.hashKey}</p>
          </div>
          {purchase.customer && (
            <>
              <h4 className="text-sm font-medium mt-4">{t("customerDetails")}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">{t("customerName")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.customer.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("customerEmail")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.customer.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("customerPhone")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.customer.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("customerLocation")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.customer.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("customerBirthDate")}</h4>
                  <p className="text-sm text-muted-foreground">{new Date(purchase.customer.birthDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("purchasesCount")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.customer.purchasesCount}</p>
                </div>
              </div>
            </>
          )}
          {purchase.provider && (
            <>
              <h4 className="text-sm font-medium mt-4">{t("providerDetails")}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">{t("providerName")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.provider.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("providerEmail")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.provider.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("providerPhone")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.provider.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("providerLocation")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.provider.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("providerDescription")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.provider.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t("providerStatus")}</h4>
                  <p className="text-sm text-muted-foreground">{purchase.provider.status}</p>
                </div>
              </div>
            </>
          )}
          {purchase.purchaseCoupons && purchase.purchaseCoupons.length > 0 && (
            <>
              <h4 className="text-sm font-medium mt-4">{t("purchaseCoupons")}</h4>
              <div className="grid gap-2">
                {purchase.purchaseCoupons.map((coupon) => (
                  <div key={coupon.id} className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">{t("couponId")}</h4>
                      <p className="text-sm text-muted-foreground">{coupon.couponId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{t("purchaseKey")}</h4>
                      <p className="text-sm text-muted-foreground">{coupon.purchaseKey}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PurchasesTable = ({
  t,
  purchases,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedPurchases,
  setSelectedPurchases,
  handleDeleteSelected,
  handleSelectPurchase,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const columns = useMemo(
    () => [
      { key: "select", label: t("select") || "Select" },
      { key: "customerId", label: t("customerId") || "Customer ID" },
      { key: "providerId", label: t("providerId") || "Provider ID" },
      { key: "purchaseType", label: t("purchaseType") || "Purchase Type" },
      { key: "date", label: t("date") || "Date" },
      { key: "paidAmount", label: t("paidAmount") || "Paid Amount" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t],
  );

  const displayedData = useMemo(
    () => (isRTL ? [...purchases].reverse() : purchases),
    [purchases, isRTL],
  );

  const handleToggleSelectAll = () => {
    const allSelected = purchases.every((purchase) =>
      selectedPurchases.includes(purchase.id),
    );
    setSelectedPurchases(allSelected ? [] : purchases.map((purchase) => purchase.id));
  };

  return (
    <>
      <PurchaseDetailsModal
        purchase={selectedPurchase}
        t={t}
        open={!!selectedPurchase}
        onOpenChange={(open) => !open && setSelectedPurchase(null)}
      />
      
      <Card className="shadow-none">
        <CardContent className="p-x-2">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleToggleSelectAll}
              disabled={purchases.length === 0}
            >
              {t(
                selectedPurchases.length === purchases.length && purchases.length > 0
                  ? "deselectAll"
                  : "selectAll",
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={selectedPurchases.length === 0}
                >
                  {t("deleteSelected")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("confirmDeleteDesc", { count: selectedPurchases.length })}
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
                        {t("noPurchasesFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((purchase) => (
                      <TableRow
                        key={purchase.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${purchase.id}-${column.key}`}
                            className={`px-4 py-3 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {renderTableCellContent(
                              purchase,
                              column.key,
                              isRTL,
                              t,
                              handleSelectPurchase,
                              setSelectedPurchase,
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
  purchase,
  key,
  isRTL,
  t,
  handleSelectPurchase,
  setSelectedPurchase,
) {
  switch (key) {
    case "select":
      return (
        <Checkbox
          className="mx-6"
          checked={purchase.isSelected}
          onCheckedChange={() => handleSelectPurchase(purchase.id)}
        />
      );
    case "customerId":
      return <span>{purchase.customerId}</span>;
    case "providerId":
      return <span>{purchase.providerId}</span>;
    case "purchaseType":
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            purchase.purchaseType === "Bank Transfer"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : purchase.purchaseType === "Package Purchase"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          }`}
        >
          {t(purchase.purchaseType.replace(/\s+/g, ''))}
        </span>
      );
    case "date":
      return <span>{new Date(purchase.date).toLocaleDateString()}</span>;
    case "paidAmount":
      return <span>{purchase.paidAmount}</span>;
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedPurchase(purchase)}
          >
            {t("viewDetails")}
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function PurchasesAllPage() {
  const t = useTranslations("Purchases");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPurchases, setSelectedPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed:", e.key, "Input value:", inputValue);
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }
  };

  const handleSelectPurchase = useCallback((id) => {
    setPurchases((prevPurchases) =>
      prevPurchases.map((purchase) =>
        purchase.id === id
          ? { ...purchase, isSelected: !purchase.isSelected }
          : purchase
      )
    );
    setSelectedPurchases((prev) =>
      prev.includes(id)
        ? prev.filter((purchaseId) => purchaseId !== id)
        : [...prev, id]
    );
  }, []);

  const fetchPurchasesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        purchases,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchPurchases(currentPage, PURCHASES_PER_PAGE, searchQuery, filterType);
      console.log("Fetched purchases:", purchases, "Total pages:", totalPages, "Current page:", apiCurrentPage);
      if (!Array.isArray(purchases)) {
        throw new Error("Purchases data is not an array");
      }
      setPurchases(
        purchases.map((purchase) => ({
          ...purchase,
          isSelected: selectedPurchases.includes(purchase.id),
        }))
      );
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchPurchasesData:", {
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
      setPurchases([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, filterType, t]);

  useEffect(() => {
    console.log("Fetching purchases for page:", currentPage, "Search:", searchQuery, "Filter:", filterType);
    fetchPurchasesData();
  }, [fetchPurchasesData]);

  const handleDeleteSelected = async () => {
    console.log("Selected Purchases:", selectedPurchases);
    setIsLoading(true);
    try {
      const deletePromises = selectedPurchases.map((id) => deletePurchase(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        console.error("Failed to delete some purchases:", failedDeletions);
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Purchase ID ${result.id}: ${status ? `Status ${status} - ` : ""}${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(t("deleteSuccessDesc", { count: selectedPurchases.length }), {
          description: t("deleteSuccess"),
          duration: 3000,
        });
        setSelectedPurchases([]);
        setCurrentPage(1);
        await fetchPurchasesData();
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
    { label: t("BankTransfer"), value: "Bank Transfer" },
    { label: t("PackagePurchase"), value: "Package Purchase" },
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
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-muted-foreground"
                    onClick={() => {
                      console.log("Toggling filter menu, current state:", isFilterMenuOpen);
                      setIsFilterMenuOpen(!isFilterMenuOpen);
                    }}
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
                            filterType === item.value ? "bg-gray-200 dark:bg-gray-600" : ""
                          }`}
                          onClick={() => {
                            setFilterType(item.value);
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
          <PurchasesTable
            t={t}
            purchases={purchases}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedPurchases={selectedPurchases}
            setSelectedPurchases={setSelectedPurchases}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectPurchase={handleSelectPurchase}
          />
        </>
      )}
    </div>
  );
}