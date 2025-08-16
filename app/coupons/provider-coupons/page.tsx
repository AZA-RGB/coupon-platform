"use client";
import { useState, useMemo, useEffect } from "react";
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
import { Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
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
import { fetchCoupons, fetchCouponStats, deleteCoupon } from "./constants";
import MyImage from "@/components/my-image";
import { MobileSummaryCards, SummaryCards } from "../summary_cards";

const NavigationCards = ({ t }) => {
  return (
    <div className="w-full lg:w-2/6 flex flex-col sm:flex-row sm:grid-cols-1">
      <Link href="/coupons/admin-top-coupons" className="block w-full">
        <Card className="w-full hover:shadow-sm shadow-none transition-shadow h-full cursor-pointer p-6">
          <CardTitle className="text-lg text-primary mb-1">
            {t("seeTopCoupons")}
          </CardTitle>
          <CardDescription>{t("seeTopCouponsDesc")}</CardDescription>
        </Card>
      </Link>
    </div>
  );
};

const CouponsGrid = ({
  t,
  coupons,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedCoupons,
  setSelectedCoupons,
  handleDeleteSelected,
}) => {
  const handleSelectCoupon = (id) => {
    setSelectedCoupons((prev) =>
      prev.includes(id)
        ? prev.filter((couponId) => couponId !== id)
        : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const allSelected = coupons.every((coupon) =>
      selectedCoupons.includes(coupon.id)
    );
    setSelectedCoupons(allSelected ? [] : coupons.map((coupon) => coupon.id));
  };

  return (
    <Card className="shadow-none">
      <CardContent className="pt-2">
        {coupons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("noCouponsFound")}
          </div>
        ) : (
          <>
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                onClick={handleToggleSelectAll}
                disabled={coupons.length === 0}
                className="cursor-pointer"
              >
                {t(
                  selectedCoupons.length === coupons.length &&
                    coupons.length > 0
                    ? "deselectAll"
                    : "selectAll"
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    disabled={selectedCoupons.length === 0}
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
                        count: selectedCoupons.length,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {coupons.map((coupon) => (
                <Card
                  key={coupon.id}
                  className="overflow-hidden shadow-none transition-shadow p-0"
                >
                  <div className="relative w-full h-32">
                    <MyImage src={coupon.image} alt={coupon.name} />
                    <div className="absolute bottom-1 left-1 bg-background/90 px-2 py-0.5 rounded text-xs">
                      <span className="text-primary font-bold">
                        {coupon.discount}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="py-0 px-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedCoupons.includes(coupon.id)}
                        onCheckedChange={() => handleSelectCoupon(coupon.id)}
                      />
                      <CardTitle className="text-lg">
                        {coupon.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="flex justify-between items-center text-xs">
                      <span>{coupon.type}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          coupon.status === "active"
                            ? "bg-green-100 text-green-800"
                            : coupon.status === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t(coupon.status)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-1 px-3">
                    <div className="flex justify-between text-xs">
                      <span>
                        {t("uses")}: {coupon.uses}
                      </span>
                      <span>
                        {t("code")}: {coupon.code}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-3 pb-3">
                    <Button
                      variant="outline"
                      className="w-full h-8 text-xs"
                      asChild
                    >
                      <Link href={`/dashboard/coupons/${coupon.id}`}>
                        {t("viewDetails")}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              >
                {t("previous")}
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              >
                {t("next")}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

export default function AllCouponsPage() {
  const t = useTranslations("Coupons");
  const { locale } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [coupons, setCoupons] = useState([]);
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

  useEffect(() => {
    const loadCoupons = async () => {
      setIsLoading(true);
      try {
        const {
          coupons,
          totalPages,
          currentPage: apiCurrentPage,
        } = await fetchCoupons(currentPage, searchQuery, statusFilter);
        setCoupons(coupons);
        setTotalPages(totalPages);
        if (apiCurrentPage !== currentPage) {
          setCurrentPage(apiCurrentPage);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error(t("fetchErrorDesc"), {
          description: t("fetchError"),
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadCoupons();
  }, [currentPage, searchQuery, statusFilter]);

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    try {
      const deletePromises = selectedCoupons.map((id) => deleteCoupon(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Coupon ID ${result.id}: ${
            status ? `Status ${status} - ` : ""
          }${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(
          t("deleteSuccessDesc", { count: selectedCoupons.length }),
          {
            description: t("deleteSuccess"),
            duration: 3000,
          }
        );
        setSelectedCoupons([]);
        setCurrentPage(1);
        await fetchCoupons(currentPage, searchQuery, statusFilter);
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
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentCoupons = useMemo(() => {
    return coupons.sort((a, b) => {
      if (filterType === "newest") {
        return new Date(b.addDate).getTime() - new Date(a.addDate).getTime();
      } else if (filterType === "oldest") {
        return new Date(a.addDate).getTime() - new Date(b.addDate).getTime();
      }
      return 0;
    });
  }, [coupons, filterType]);

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
          {/* Section 1: Summary and Navigation */}
          <div className="flex flex-col lg:flex-row gap-4">
            <SummaryCards t={t} />
            <NavigationCards t={t} />
            <MobileSummaryCards t={t} />
          </div>

          {/* Section 2: Header with Filter and New Coupon */}
          <Card className="shadow-none relative overflow-visible">
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
                <Button asChild size="sm">
                  <Link href="/coupons/AddCoupon">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("newCoupon")}
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Section 3: Coupons Grid */}
          <CouponsGrid
            t={t}
            coupons={currentCoupons}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedCoupons={selectedCoupons}
            setSelectedCoupons={setSelectedCoupons}
            handleDeleteSelected={handleDeleteSelected}
          />
        </>
      )}
    </div>
  );
}
