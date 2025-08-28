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
import { Badge, Edit, Filter, Plus, Search } from "lucide-react";
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
import { fetchCoupons, deleteCoupon, fetchCouponDetails, createGiftProgram, deleteGiftProgram } from "./constants";
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!coupon) return null;

  const handleDeleteGift = async (giftId) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return isDarkMode
          ? "bg-[#00cbc1]/30 text-[#00cbc1] border-[#00cbc1]"
          : "bg-[#00cbc1]/10 text-[#00cbc1] border-[#00cbc1]";
      case "expired":
        return isDarkMode
          ? "bg-red-900/30 text-red-300 border-red-700"
          : "bg-red-100 text-red-800 border-red-200";
      case "upcoming":
        return isDarkMode
          ? "bg-[#00cbc1]/30 text-[#00cbc1] border-[#00cbc1]"
          : "bg-[#00cbc1]/10 text-[#00cbc1] border-[#00cbc1]";
      default:
        return isDarkMode
          ? "bg-gray-800 text-gray-300 border-gray-600"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const textMutedColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const cardBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[700px] max-h-[85vh] overflow-y-auto overflow-x-hidden p-0 ${bgColor}`}>
        <div className="relative">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r from-[#00cbc1] to-[#00a39c] p-6 text-white`}>
            <DialogHeader className="space-y-2">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-2xl font-bold">{coupon.name}</DialogTitle>
                <Badge className={`${getStatusColor(coupon.coupon_status)} capitalize font-semibold`}>
                  {t(coupon.coupon_status)}
                </Badge>
              </div>
              <DialogDescription className="text-white/80">
                {coupon.description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className={`p-6 ${bgColor}`}>
            {/* Coupon Images */}
            {coupon.files.length > 0 && (
              <div className="mb-6">
                <h4 className={`text-lg font-semibold mb-3 flex items-center ${textColor}`}>
                  <i className="fas fa-images mr-2 text-[#00cbc1]"></i>
                  {t("files")}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {coupon.files.map((file) => (
                    <div key={file.id} className={`relative w-full h-40 rounded-lg overflow-hidden ${borderColor}`}>
                      <MyImage
                        src={file.path}
                        alt={file.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon Code */}
            <div className={`${isDarkMode ? 'bg-[#00cbc1]/20 border-[#00cbc1]' : 'bg-[#00cbc1]/10 border-[#00cbc1]'} border rounded-lg p-4 mb-6`}>
              <h4 className={`text-sm font-medium ${isDarkMode ? 'text-[#00cbc1]' : 'text-[#00cbc1]'} mb-1`}>{t("couponCode")}</h4>
              <div className="flex items-center justify-between">
                <p className={`text-2xl font-mono font-bold ${isDarkMode ? 'text-[#00cbc1]' : 'text-[#00cbc1]'}`}>{coupon.coupon_code}</p>
                <Button variant="outline" size="sm" className={`${isDarkMode ? 'text-[#00cbc1] border-[#00cbc1]' : 'text-[#00cbc1] border-[#00cbc1]'}`}>
                  <i className="fas fa-copy mr-2"></i>
                  Copy Code
                </Button>
              </div>
            </div>

            {/* Main Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <DetailCard title={t("discount")} value={coupon.price} icon="fa-tag" isDarkMode={isDarkMode} />
              <DetailCard title={t("date")} value={new Date(coupon.date).toLocaleDateString()} icon="fa-calendar" isDarkMode={isDarkMode} />
              <DetailCard title={t("category")} value={coupon.category} icon="fa-folder" isDarkMode={isDarkMode} />
              <DetailCard title={t("couponType")} value={coupon.coupon_type} icon="fa-ticket-alt" isDarkMode={isDarkMode} />
              <DetailCard title={t("provider")} value={coupon.provider} icon="fa-store" isDarkMode={isDarkMode} />
              <DetailCard title={t("providerLocation")} value={coupon.provider_location} icon="fa-map-marker-alt" isDarkMode={isDarkMode} />
              <DetailCard title={t("providerEmail")} value={coupon.provider_email} icon="fa-envelope" isEmail isDarkMode={isDarkMode} />
              <DetailCard title={t("providerPhone")} value={coupon.provider_phone} icon="fa-phone" isPhone isDarkMode={isDarkMode} />
            </div>

            {/* Criteria */}
            {coupon.couponCriteria.length > 0 && (
              <div className="mb-6">
                <h4 className={`text-lg font-semibold mb-3 flex items-center ${textColor}`}>
                  <i className="fas fa-list-alt mr-2 text-[#00cbc1]"></i>
                  {t("couponCriteria")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coupon.couponCriteria.map((criteria) => (
                    <div key={criteria.id} className={`${cardBgColor} p-3 rounded-lg ${borderColor}`}>
                      <p className={`text-sm font-medium ${textColor}`}>{criteria.criteria_name}</p>
                      <p className={`text-sm ${textMutedColor}`}>
                        {criteria.value} <span className="text-xs text-gray-500">({criteria.criteria_type})</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gift Programs */}
            {coupon.giftPrograms.length > 0 ? (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`text-lg font-semibold flex items-center ${textColor}`}>
                    <i className="fas fa-gift mr-2 text-[#00cbc1]"></i>
                    {t("giftPrograms")}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCouponId(coupon.id);
                      setGiftModalOpen(true);
                      onOpenChange(false);
                    }}
                    className={`${isDarkMode ? 'text-[#00cbc1] border-[#00cbc1]' : 'text-[#00cbc1] border-[#00cbc1]'}`}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    {t("addGift")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {coupon.giftPrograms.map((gift) => (
                    <div key={gift.id} className={`${isDarkMode ? 'bg-[#00cbc1]/20 border-[#00cbc1]' : 'bg-[#00cbc1]/10 border-[#00cbc1]'} border rounded-lg p-4 flex justify-between items-center`}>
                      <div>
                        <p className={`font-medium ${textColor}`}>
                          {gift.gift_coupon_id
                            ? `${t("giftCoupon")}: ${gift.gift_coupon_id}`
                            : `${t("points")}: ${gift.points_value}`}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${gift.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span className={`text-sm ${textMutedColor}`}>
                            {gift.is_active ? t("active") : t("inactive")}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteGift(gift.id)}
                        className="h-8"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        {t("removeGift")}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`text-center py-6 border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg mb-6`}>
                <i className="fas fa-gift text-3xl text-gray-400 mb-3"></i>
                <p className={`${textMutedColor} mb-4`}>{t("noGiftPrograms")}</p>
                <Button
                  onClick={() => {
                    setSelectedCouponId(coupon.id);
                    setGiftModalOpen(true);
                    onOpenChange(false);
                  }}
                  className="bg-[#00cbc1] hover:bg-[#00a39c] text-white"
                >
                  <i className="fas fa-plus mr-2"></i>
                  {t("addGift")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper DetailCard
const DetailCard = ({ title, value, icon, isEmail = false, isPhone = false, isDarkMode = false }) => {
  const cardBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`${cardBgColor} p-3 rounded-lg ${borderColor}`}>
      <div className="flex items-center mb-1">
        <i className={`fas ${icon} text-[#00cbc1] mr-2`}></i>
        <h4 className={`text-sm font-medium ${textColor}`}>{title}</h4>
      </div>
      {isEmail ? (
        <a href={`mailto:${value}`} className="text-[#00cbc1] hover:underline">{value}</a>
      ) : isPhone ? (
        <a href={`tel:${value}`} className="text-[#00cbc1] hover:underline">{value}</a>
      ) : (
        <p className={`text-sm ${textColor}`}>{value || "N/A"}</p>
      )}
    </div>
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [giftType, setGiftType] = useState<"coupon" | "points">("coupon");
  const [selectedGiftCouponId, setSelectedGiftCouponId] = useState("");
  const [pointsValue, setPointsValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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
        ...(giftType === "coupon"
          ? { coupon_id: parseInt(selectedGiftCouponId) }
          : { points: parseInt(pointsValue) }),
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
    } catch (error: any) {
      console.error("Error creating gift program:", error);
      toast.error(t("giftErrorDesc"), {
        description: error.response?.data?.message || t("giftError"),
        duration: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const textMutedColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const primaryColor = "#00cbc1";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[500px] p-0 overflow-hidden ${bgColor}`}>
        {/* Header with primary color gradient */}
        <div
          className="p-6 text-white"
          style={{ background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})` }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <i className="fas fa-gift mr-2" style={{ color: "#fff" }}></i>
              {t("addGift")}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {t("addGiftDesc")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* Gift Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center ${textColor}`}>
              <i className="fas fa-list mr-2" style={{ color: primaryColor }}></i>
              {t("giftType")}
            </label>
            <Select
              value={giftType}
              onValueChange={(value: "coupon" | "points") => setGiftType(value)}
            >
              <SelectTrigger className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <SelectValue placeholder={t("selectGiftType")} />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <SelectItem value="coupon" className="flex items-center">
                  <i className="fas fa-ticket-alt mr-2" style={{ color: primaryColor }}></i>
                  {t("couponGift")}
                </SelectItem>
                <SelectItem value="points" className="flex items-center">
                  <i className="fas fa-coins mr-2 text-yellow-500"></i>
                  {t("pointsGift")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields */}
          {giftType === "coupon" ? (
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center ${textColor}`}>
                <i className="fas fa-ticket-alt mr-2" style={{ color: primaryColor }}></i>
                {t("selectGiftCoupon")}
              </label>
              <Select value={selectedGiftCouponId} onValueChange={setSelectedGiftCouponId}>
                <SelectTrigger className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <SelectValue placeholder={t("selectCoupon")} />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                  {coupons
                    .filter((coupon) => coupon.id !== couponId)
                    .map((coupon) => (
                      <SelectItem
                        key={coupon.id}
                        value={coupon.id.toString()}
                        className={isDarkMode ? "hover:bg-gray-700" : ""}
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-1 rounded mr-2`}
                            style={{
                              backgroundColor: isDarkMode ? "rgba(0,203,193,0.3)" : "rgba(0,203,193,0.2)",
                              color: primaryColor,
                            }}
                          >
                            <i className="fas fa-ticket-alt text-xs"></i>
                          </div>
                          <div>
                            <p className={`font-medium ${textColor}`}>{coupon.name}</p>
                            <p className={`text-xs ${textMutedColor}`}>{coupon.coupon_code}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center ${textColor}`}>
                <i className="fas fa-coins mr-2 text-yellow-500"></i>
                {t("points")}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={t("enterPoints")}
                  value={pointsValue}
                  onChange={(e) => setPointsValue(e.target.value)}
                  min="1"
                  className={`pl-10 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-coins text-yellow-500"></i>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2"
            style={{
              backgroundColor: primaryColor,
              color: "#fff",
            }}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t("submitting")}
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle mr-2"></i>
                {t("submit")}
              </>
            )}
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
          },
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
        },
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
                 <Button asChild size="sm">
                  <Link href="/coupons/AddCoupon">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("newCoupon")}
                  </Link>
                </Button>
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
            selectedCoupons={selectedCoupons}
            setSelectedCoupons={setSelectedCoupons}
            handleDeleteSelected={handleDeleteSelected}
          />
        </>
      )}
    </div>
  );
}