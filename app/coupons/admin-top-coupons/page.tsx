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
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchTopCoupons, fetchCouponDetails } from "./constants";
import MyImage from "@/components/my-image";

const CouponDetailsModal = ({ coupon, t, open, onOpenChange }) => {
  if (!coupon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{coupon.name}</DialogTitle>
          <DialogDescription>{coupon.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {coupon.files.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">{t("files")}</h4>
              <div className="grid grid-cols-2 gap-2">
                {coupon.files.map((file) => (
                  <div key={file.id} className="relative w-full h-32">
                    <MyImage src={file.path} alt={file.name} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("couponCode")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.coupon_code}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("status")}</h4>
              <p className="text-sm text-muted-foreground capitalize">{t(coupon.coupon_status)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("discount")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.price}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("date")}</h4>
              <p className="text-sm text-muted-foreground">{new Date(coupon.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("category")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.category}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("couponType")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.coupon_type}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("provider")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.provider}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("providerLocation")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.provider_location}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("providerEmail")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.provider_email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("providerPhone")}</h4>
              <p className="text-sm text-muted-foreground">{coupon.provider_phone}</p>
            </div>
          </div>
          {coupon.couponCriteria.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">{t("couponCriteria")}</h4>
              <ul className="text-sm text-muted-foreground">
                {coupon.couponCriteria.map((criteria) => (
                  <li key={criteria.id}>
                    {criteria.criteria_name}: {criteria.value} ({criteria.criteria_type})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CouponsGrid = ({
  t,
  coupons,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = async (id) => {
    try {
      const couponDetails = await fetchCouponDetails(id);
      setSelectedCoupon(couponDetails);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching coupon details:", error);
      toast.error(t("fetchDetailsErrorDesc"), {
        description: t("fetchDetailsError"),
        duration: 5000,
      });
    }
  };

  return (
    <>
      <CouponDetailsModal
        coupon={selectedCoupon}
        t={t}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
      <Card className="shadow-none">
        <CardContent className="pt-2">
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("noCouponsFound")}
            </div>
          ) : (
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
                    <CardTitle className="text-lg truncate whitespace-nowrap overflow-hidden">
                      {coupon.name}
                    </CardTitle>
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
                      onClick={() => handleViewDetails(coupon.id)}
                    >
                      {t("viewDetails")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
    </>
  );
};

export default function TopCouponsPage() {
  const t = useTranslations("Coupons");
  const { locale } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
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
        } = await fetchTopCoupons(currentPage, searchQuery, statusFilter);
        setCoupons(coupons);
        setTotalPages(totalPages);
        if (apiCurrentPage !== currentPage) {
          setCurrentPage(apiCurrentPage);
        }
      } catch (error) {
        console.error("Error fetching top coupons:", error);
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
          <Card className="shadow-none relative overflow-visible">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>{t("topCouponsTitle")}</CardTitle>
                <CardDescription>{t("topCouponsDesc")}</CardDescription>
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
          <CouponsGrid
            t={t}
            coupons={currentCoupons}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}