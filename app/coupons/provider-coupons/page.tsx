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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCoupons, fetchCouponStats, deleteCoupon, fetchCouponDetails, createGiftProgram, deleteGiftProgram } from "./constants";
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

const CouponDetailsModal = ({
  coupon,
  t,
  open,
  onOpenChange,
  setGiftModalOpen,
  setSelectedCouponId,
  refreshCouponDetails,
}) => {
  if (!coupon) return null;

  const handleDeleteGift = async (giftId: number) => {
    try {
      const result = await deleteGiftProgram(giftId);
      if (result.success) {
        toast.success(t("giftDeleteSuccess"), {
          description: t("giftDeleteSuccessDesc"),
          duration: 3000,
        });
        await refreshCouponDetails();
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Error deleting gift program:", error);
      toast.error(t("giftDeleteErrorDesc"), {
        description: error.response?.data?.message || t("giftDeleteError"),
        duration: 7000,
      });
    }
  };

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
          {coupon.giftPrograms.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">{t("giftPrograms")}</h4>
              <ul className="text-sm text-muted-foreground">
                {coupon.giftPrograms.map((gift) => (
                  <li key={gift.id} className="flex justify-between items-center">
                    <span>
                      {gift.gift_coupon_id
                        ? `Gift Coupon ID: ${gift.gift_coupon_id}`
                        : `Points: ${gift.points_value}`}, Active: {gift.is_active ? 'Yes' : 'No'}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteGift(gift.id)}
                    >
                      {t("removeGift")}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {coupon.giftPrograms.length === 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCouponId(coupon.id);
                setGiftModalOpen(true);
                onOpenChange(false);
              }}
            >
              {t("addGift")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GiftProgramModal = ({
  couponId,
  coupons,
  t,
  open,
  onOpenChange,
  refreshCoupons,
}) => {
  const [giftType, setGiftType] = useState<"coupon" | "points">("coupon");
  const [selectedGiftCouponId, setSelectedGiftCouponId] = useState("");
  const [pointsValue, setPointsValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (giftType === "coupon" && !selectedGiftCouponId) {
      toast.error(t("selectCouponError"), {
        description: t("selectCouponErrorDesc"),
        duration: 5000,
      });
      return;
    }
    if (giftType === "points" && (!pointsValue || parseInt(pointsValue) <= 0)) {
      toast.error(t("invalidPointsError"), {
        description: t("invalidPointsErrorDesc"),
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const giftData = {
        type: "coupon",
        giftable_id: couponId,
        ...(giftType === "coupon" ? { coupon_id: parseInt(selectedGiftCouponId) } : { points: parseInt(pointsValue) }),
      };
      const result = await createGiftProgram(giftData);
      if (result.success) {
        toast.success(t("giftSuccess"), {
          description: t("giftSuccessDesc"),
          duration: 3000,
        });
        onOpenChange(false);
        refreshCoupons();
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating gift program:", error);
      toast.error(t("giftErrorDesc"), {
        description: error.response?.data?.message || t("giftError"),
        duration: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("addGift")}</DialogTitle>

          <DialogDescription>{t("addGiftDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h4 className="text-sm font-medium">{t("giftType")}</h4>
              <div className="py-2"></div>
            <Select  value={giftType} onValueChange={(value: "coupon" | "points") => setGiftType(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectGiftType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coupon">{t("couponGift")}</SelectItem>
                <SelectItem value="points">{t("pointsGift")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {giftType === "coupon" ? (
            <div>
              <h4 className="text-sm font-medium">{t("selectGiftCoupon")}</h4>
              <div className="py-2"></div>
              <Select
                value={selectedGiftCouponId}
                onValueChange={setSelectedGiftCouponId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCoupon")} />
                </SelectTrigger>
                <SelectContent>
                  {coupons
                    .filter((coupon) => coupon.id !== couponId)
                    .map((coupon) => (
                      <SelectItem key={coupon.id} value={coupon.id.toString()}>
                        {coupon.name} ({coupon.coupon_code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-medium">{t("points")}</h4>
              <Input
                type="number"
                placeholder={t("enterPoints")}
                value={pointsValue}
                onChange={(e) => setPointsValue(e.target.value)}
                min="1"
              />
            </div>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
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
  selectedCoupons,
  setSelectedCoupons,
  handleDeleteSelected,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

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

  const refreshCouponDetails = async () => {
    if (selectedCoupon) {
      try {
        const couponDetails = await fetchCouponDetails(selectedCoupon.id);
        setSelectedCoupon(couponDetails);
      } catch (error) {
        console.error("Error refreshing coupon details:", error);
        toast.error(t("fetchDetailsErrorDesc"), {
          description: t("fetchDetailsError"),
          duration: 5000,
        });
      }
    }
  };

  return (
    <>
      <CouponDetailsModal
        coupon={selectedCoupon}
        t={t}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        setGiftModalOpen={setIsGiftModalOpen}
        setSelectedCouponId={setSelectedCouponId}
        refreshCouponDetails={refreshCouponDetails}
      />
      <GiftProgramModal
        couponId={selectedCouponId}
        coupons={coupons}
        t={t}
        open={isGiftModalOpen}
        onOpenChange={setIsGiftModalOpen}
        refreshCoupons={() => fetchCoupons(currentPage, "", "")}
      />
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
                        onClick={() => handleViewDetails(coupon.id)}
                      >
                        {t("viewDetails")}
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
    </>
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

  useEffect(() => {
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
        await loadCoupons();
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
          <div className="flex flex-col lg:flex-row gap-4">
            <SummaryCards t={t} />
            <NavigationCards t={t} />
            <MobileSummaryCards t={t} />
          </div>
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