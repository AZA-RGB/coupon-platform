"use client";
import { useState, useEffect, useMemo } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import debounce from "lodash/debounce";
import {
  fetchCouponTypes,
  deleteCouponType,
  fetchTopCategories,
} from "./constants";
import MyImage from "@/components/my-image";
import AddTypeDialog from "@/components/AddType";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

const COUPONS_PER_PAGE = 10;

const CouponTypesGrid = ({
  t,
  couponTypes,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedTypes,
  setSelectedTypes,
  handleDeleteSelected,
}) => {
  const [typeIdDetails, setTypeIdDetails] = useState(null);

  const {
    data: typeDetails,
    error: typeDetailsError,
    isLoading: loadingTypeDetails,
    mutate,
  } = useSWR(
    typeIdDetails ? `/criterias/for-add-Coupon/list/${typeIdDetails}` : null,
  );

  const handleSelectType = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.filter((typeId) => typeId !== id)
        : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    const allSelected = couponTypes.every((type) =>
      selectedTypes.includes(type.id),
    );
    setSelectedTypes(allSelected ? [] : couponTypes.map((type) => type.id));
  };

  if (!Array.isArray(couponTypes)) {
    console.error("CouponTypes is not an array:", couponTypes);
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t("noTypesFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {couponTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("noTypesFound")}
          </div>
        ) : (
          <>
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                onClick={handleToggleSelectAll}
                disabled={couponTypes.length === 0}
              >
                {t(
                  selectedTypes.length === couponTypes.length &&
                    couponTypes.length > 0
                    ? "deselectAll"
                    : "selectAll",
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    disabled={selectedTypes.length === 0}
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
                      {t("confirmDeleteDesc", { count: selectedTypes.length })}
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
              {couponTypes.map((type) => (
                <Card
                  key={type.id}
                  className="overflow-hidden hover:shadow-md transition-shadow p-0"
                >
                  <div className="relative w-full h-32">
                    <MyImage
                      src={type.image}
                      alt={type.name || "Coupon Image"}
                      width={300}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="py-0 px-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={() => handleSelectType(type.id)}
                      />
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                    </div>
                    <CardDescription className="flex justify-between items-center text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          type.status === "active"
                            ? "bg-green-100 text-green-800"
                            : type.status === "expired"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t(type.status)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="px-3 pb-3 flex justify-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 h-8"
                          onClick={() => {
                            console.log(type);
                            setTypeIdDetails(type.id);
                          }}
                        >
                          {t("details")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <ScrollArea className="max-h-[200px] w-auto overflow-auto rounded-md border p-3">
                          {loadingTypeDetails ? (
                            <div>
                              <Spinner className="animate-spin" />
                            </div>
                          ) : typeDetailsError ? (
                            <div>Error loading details</div>
                          ) : typeDetails &&
                            typeDetails.data?.by_type?.length > 0 ? (
                            typeDetails.data.by_type.map((criterion, index) => (
                              <div key={index}>
                                <div className="flex space-x-4 place-content-between">
                                  <div className="text-sm">
                                    {criterion.name || "Unnamed criterion"}
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-sm"
                                  >
                                    {criterion.type || "Unnamed criterion"}
                                  </Badge>
                                </div>
                                <Separator className="my-2" />
                              </div>
                            ))
                          ) : (
                            <div>No details available</div>
                          )}
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
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

const TopCategoriesCard = ({ t }) => {
  const {
    data: topCategories,
    error,
    isLoading,
  } = useSWR("/categories/top-selling-categories");

  if (isLoading) {
    return (
      <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
        <CardTitle className="text-lg text-primary mb-1">
          {t("topCategories")}
        </CardTitle>
        <div className="flex justify-center items-center h-32">
          <Spinner className="animate-spin" />
        </div>
      </Card>
    );
  }

  if (error || !topCategories || !Array.isArray(topCategories.data)) {
    return (
      <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
        <CardTitle className="text-lg text-primary mb-1">
          {t("topCategories")}
        </CardTitle>
        <div className="text-center py-8 text-muted-foreground">
          {t("noCategoriesFound")}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
      <CardTitle className="text-lg text-primary mb-1">
        {t("topCategories")}
      </CardTitle>
      <div className="space-y-4">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4 text-start">
                {t("rank")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("category")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("sales")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("popularity")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCategories.data.slice(0, 3).map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{index + 1}</TableCell>
                <TableCell className="py-2 px-4">{row.name}</TableCell>
                <TableCell className="py-2 px-4">{row.sales_count}</TableCell>
                <TableCell className="py-2 px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${row.popularity}%` }}
                    ></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

const ReportGeneratorCard = ({
  t,
  couponType,
  setCouponType,
  dateRange,
  setDateRange,
  handleGenerateReport,
}) => {
  return (
    <Card className="w-full lg:w-2/5 p-4">
      <CardTitle className="text-lg text-primary mb-1">
        {t("generateReport")}
      </CardTitle>
      <div className="space-y-4">
        <div className="space-y-4 w-full">
          <Label htmlFor="couponType">{t("couponType")}</Label>
          <Select onValueChange={setCouponType} value={couponType}>
            <SelectTrigger className="w-full" id="couponType">
              <SelectValue placeholder={t("selectType")} />
            </SelectTrigger>
            <SelectContent>
              {couponTypeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <Label>{t("selectDate")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70 shrink-0" />
                {dateRange?.from ? (
                  dateRange?.to ? (
                    <>
                      {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                      {format(dateRange.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span className="text-muted-foreground">
                    {t("selectDate")}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  range && setDateRange({ from: range.from, to: range.to })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button className="w-full mt-2" onClick={handleGenerateReport}>
          {t("generateReport")}
        </Button>
      </div>
    </Card>
  );
};

const NavigationCards = ({ t }) => {
  return (
    <div className="w-full lg:w-2/5 flex flex-col sm:flex-row sm:grid-cols-1">
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

export default function TypesAllCouponsPage() {
  const t = useTranslations("Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [couponType, setCouponType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [couponTypes, setCouponTypes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    [],
  );

  const fetchCouponTypesData = async () => {
    setIsLoading(true);
    try {
      const {
        couponTypes,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchCouponTypes(currentPage, searchTerm, filterType);
      console.log("Setting couponTypes:", couponTypes);
      setCouponTypes(couponTypes);
      setTotalPages(totalPages);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage);
      }
    } catch (error) {
      console.error("Error fetching coupon types:", error);
      toast.error(t("fetchErrorDesc"), {
        description: t("fetchError"),
        duration: 5000,
      });
      setCouponTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCouponTypesData();
  }, [currentPage, searchTerm, filterType]);

  const handleDeleteSelected = async () => {
    console.log("Selected Coupon Types:", selectedTypes);
    setIsLoading(true);
    try {
      const deletePromises = selectedTypes.map((id) => deleteCouponType(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        console.error("Failed to delete some coupon types:", failedDeletions);
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Coupon Type ID ${result.id}: ${status ? `Status ${status} - ` : ""}${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(t("deleteSuccessDesc", { count: selectedTypes.length }), {
          description: t("deleteSuccess"),
          duration: 3000,
        });
        setSelectedTypes([]);
        setCurrentPage(1);
        await fetchCouponTypesData();
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

  const filteredCouponTypes = useMemo(() => {
    if (!Array.isArray(couponTypes)) {
      console.error(
        "filteredCouponTypes: couponTypes is not an array:",
        couponTypes,
      );
      return [];
    }
    return couponTypes;
  }, [couponTypes]);

  const currentCouponTypes = filteredCouponTypes.slice(
    (currentPage - 1) * COUPONS_PER_PAGE,
    currentPage * COUPONS_PER_PAGE,
  );

  const handleGenerateReport = () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error(t("selectDateError"));
      return;
    }
    const requestData = {
      couponType: couponType || null,
      dateFrom: format(dateRange.from, "yyyy-MM-dd"),
      dateTo: format(dateRange.to, "yyyy-MM-dd"),
    };
    console.log("Generating report with:", requestData);
  };

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <TopCategoriesCard t={t} />
            <NavigationCards t={t} />
          </div>
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <AddTypeDialog refreshTypes={fetchCouponTypesData} />
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
          <CouponTypesGrid
            t={t}
            couponTypes={currentCouponTypes}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            handleDeleteSelected={handleDeleteSelected}
          />
        </>
      )}
    </div>
  );
}
