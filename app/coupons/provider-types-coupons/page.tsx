"use client";
import { useState, useMemo } from "react";
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
import Image from "next/image";
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
import { CalendarIcon, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import {
  couponTypesData,
  couponTypeOptions,
  topCouponsData,
} from "./constants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import useSWR from "swr";

const COUPONS_PER_PAGE = 10;

const TopCouponsCard = ({ t, topCouponsData }) => {
  return (
    <Card className="w-full lg:w-3/5 p-4 flex flex-col gap-4">
      <CardTitle className="text-lg text-primary mb-1">
        {t("topCoupons")}
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
            {topCouponsData.map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{row.rank}</TableCell>
                <TableCell className="py-2 px-4">{row.category}</TableCell>
                <TableCell className="py-2 px-4">{row.sales}</TableCell>
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

const CouponTypesGrid = ({
  t,
  couponTypes,
  currentPage,
  setCurrentPage,
  totalPages,
  locale,
}) => {
  const [typeIdDetails, setTypeIdDetails] = useState(null); // Use state for typeIdDetails

  const {
    data: typeDetails,
    error: typeDetailsError,
    isLoading: loadingTypeDetails,
  } = useSWR(
    typeIdDetails ? `/criterias/for-add-Coupon/list/${typeIdDetails}` : null,
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {couponTypes.map((type) => (
            <Card
              key={type.id}
              className="overflow-hidden hover:shadow-md transition-shadow p-0"
            >
              <div className="relative w-full h-32">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-1 left-1 bg-background/90 px-2 py-0.5 rounded text-xs">
                  <span className="text-primary font-bold">
                    {type.couponsCount} {t("coupons")}
                  </span>
                </div>
              </div>
              <CardHeader className="py-0 px-3">
                <CardTitle className="text-lg">{type.name}</CardTitle>
                <CardDescription className="flex justify-between items-center text-xs">
                  <span className="line-clamp-1 text-ellipsis overflow-hidden">
                    {type.description}
                  </span>
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
              <CardContent className="py-1 px-3">
                <div className="flex justify-between text-xs">
                  <span>
                    {t("added")}:{" "}
                    {format(new Date(type.addDate), "MMM dd, yyyy")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="px-3 pb-3 flex place-content-between gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className=""
                      onClick={() => {
                        setTypeIdDetails(type.id);
                      }}
                    >
                      {t("details")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <ScrollArea className="max-h-[200px] w-auto overflow-auto rounded-md border p-3">
                      {loadingTypeDetails ? (
                        <div>
                          <Spinner className="animate-spin" />
                        </div>
                      ) : typeDetailsError ? (
                        <div>Error loading details</div>
                      ) : typeDetails &&
                        typeDetails.data?.by_type?.length > 0 ? ( //TODO: replace with by_type
                        typeDetails.data.by_type.map((criterion, index) => (
                          <div key={index}>
                            <div className="flex space-x-4 place-content-between">
                              <div className="text-sm">
                                {criterion.name || "Unnamed criterion"}
                              </div>
                              <Badge variant="secondary" className="text-sm">
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
                <Button className="w-1/2 h-8 text-xs" asChild>
                  <Link href={`/coupons/AddCoupon?typeId=${type.id}`}>
                    {t("addCoupon")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Pagination>
          <PaginationContent dir={locale === "ar" ? "rtl" : "ltr"}>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
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
                aria-label={t("next")}
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

export default function TypesAllCouponsPage() {
  const t = useTranslations("Types");
  const { locale } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [couponType, setCouponType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const filteredCouponTypes = useMemo(() => {
    return couponTypesData
      .filter((type) => {
        // Search filter
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          return (
            type.name.toLowerCase().includes(lowerSearch) ||
            type.description.toLowerCase().includes(lowerSearch)
          );
        }
        return true;
      })
      .filter((type) => {
        // Date range filter
        if (dateRange.from && dateRange.to) {
          const addDate = new Date(type.addDate);
          return addDate >= dateRange.from && addDate <= dateRange.to;
        }
        return true;
      })
      .filter((type) => {
        // Status filter
        if (["active", "expired", "pending"].includes(filterType)) {
          return type.status === filterType;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort filter
        if (filterType === "newest") {
          return new Date(b.addDate).getTime() - new Date(a.addDate).getTime();
        } else if (filterType === "oldest") {
          return new Date(a.addDate).getTime() - new Date(b.addDate).getTime();
        }
        return 0;
      });
  }, [searchTerm, dateRange, filterType]);

  const totalPages = Math.ceil(filteredCouponTypes.length / COUPONS_PER_PAGE);
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
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <TopCouponsCard t={t} topCouponsData={topCouponsData} />
        <ReportGeneratorCard
          t={t}
          couponType={couponType}
          setCouponType={setCouponType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleGenerateReport={handleGenerateReport}
        />
      </div>
      <Card>
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
        locale={locale}
      />
    </div>
  );
}
