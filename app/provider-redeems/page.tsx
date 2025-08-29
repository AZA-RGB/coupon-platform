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
import { fetchRedeems } from "./constants";


const RedeemDetailsModal = ({ redeem, t, open, onOpenChange }) => {
  if (!redeem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] p-0 bg-background border-border rounded-xl overflow-y-auto">
        <div className="relative">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-6 px-6 border-b border-border">
            <DialogHeader className="text-left">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {redeem.couponName}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-1">
                    {t("redeemedBy")} {redeem.customerName}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="px-6 py-5">
            <div className="grid gap-5">
              <div className="bg-muted/40 p-5 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2 pb-2 border-border border-b">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {t("couponDetails")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("couponName")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.couponName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("couponCode")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.couponCode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("price")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.price}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("amount")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.amount}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">{t("description")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.couponDescription}</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/40 p-5 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2 pb-2 border-border border-b">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t("customerDetails")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("customerName")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("email")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.customerEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("phone")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.customerPhone}</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/40 p-5 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2 pb-2 border-border border-b">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t("redeemDetails")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("purchaseKey")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.purchaseKey}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("redeemDate")}</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(redeem.redeemDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t("providerName")}</p>
                    <p className="text-sm font-medium text-foreground">{redeem.providerName}</p>
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

const RedeemsTable = ({ t, redeems, setSelectedRedeem }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedRedeem, setLocalSelectedRedeem] = useState(null);

  const columns = useMemo(
    () => [
      { key: "couponName", label: t("couponName") || "Coupon Name" },
      { key: "customerName", label: t("customerName") || "Customer Name" },
      { key: "purchaseKey", label: t("purchaseKey") || "Purchase Key" },
      { key: "price", label: t("price") || "Price" },
      { key: "amount", label: t("amount") || "Amount" },
      { key: "redeemDate", label: t("redeemDate") || "Redeem Date" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t],
  );

  const displayedData = useMemo(
    () => (isRTL ? [...redeems].reverse() : redeems),
    [redeems, isRTL],
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
      <RedeemDetailsModal
        redeem={selectedRedeem}
        t={t}
        open={!!selectedRedeem}
        onOpenChange={(open) => !open && setLocalSelectedRedeem(null)}
      />
      <Card className="shadow-sm">
        <CardContent className="p-2">
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
                        {t("noRedeemsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((redeem) => (
                      <TableRow
                        key={redeem.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${redeem.id}-${column.key}`}
                            className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {renderTableCellContent(
                              redeem,
                              column.key,
                              isRTL,
                              t,
                              formatDate,
                              setLocalSelectedRedeem,
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
      </Card>
    </>
  );
};

function renderTableCellContent(redeem, key, isRTL, t, formatDate, setLocalSelectedRedeem) {
  switch (key) {
    case "couponName":
      return <span className="font-medium">{redeem.couponName}</span>;
    case "customerName":
      return <span>{redeem.customerName}</span>;
    case "purchaseKey":
      return <span>{redeem.purchaseKey}</span>;
    case "price":
      return <span>{redeem.price}</span>;
    case "amount":
      return <span>{redeem.amount}</span>;
    case "redeemDate":
      return formatDate(redeem.redeemDate);
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setLocalSelectedRedeem(redeem)}
          >
            {t("viewDetails")}
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function ProviderRedeemsDashboard() {
  const t = useTranslations("Redeems");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [filterType, setFilterType] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [redeems, setRedeems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
    }
  };

  const fetchRedeemsData = async () => {
    setIsLoading(true);
    try {
      const { redeems } = await fetchRedeems(searchQuery);
      if (!Array.isArray(redeems)) {
        throw new Error("Redeems data is not an array");
      }
      setRedeems(redeems);
    } catch (error) {
      console.error("Error in fetchRedeemsData:", {
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
      setRedeems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRedeemsData();
  }, [searchQuery]);

  const currentRedeems = useMemo(() => {
    return redeems.sort((a, b) => {
      if (filterType === "newest") {
        return new Date(b.redeemDate).getTime() - new Date(a.redeemDate).getTime();
      } else if (filterType === "oldest") {
        return new Date(a.redeemDate).getTime() - new Date(b.redeemDate).getTime();
      }
      return 0;
    });
  }, [redeems, filterType]);

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
  ];

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* <div className="flex flex-col lg:flex-row gap-4 w-full">
            <NavigationCards t={t} />
          </div> */}
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
                            filterType === item.value ? "bg-gray-200 dark:bg-gray-600" : ""
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
          <RedeemsTable t={t} redeems={currentRedeems} />
        </>
      )}
    </div>
  );
}