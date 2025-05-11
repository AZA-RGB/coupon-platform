"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns/format";
import { toast } from "sonner";

// Constants
import {
  couponTypesData,
  couponTypeOptions,
  topCouponsData,
} from "./constants";

// Components
import { DashboardHeader } from "@/components/types-coupons/header-dashboard";
import { CouponManagementHeader, filterCoupons } from "@/components/types-coupons/manage-type";
import { CouponGrid } from "@/components/types-coupons/grid-types-coupon";
import { CouponPagination, paginateCoupons } from "@/components/types-coupons/footer-types";


// Types
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export default function CouponManagementPage() {
  const t = useTranslations("Types");
  const locale = useLocale();
  const [filterType, setFilterType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [couponType, setCouponType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Constants
  const couponsPerPage = 10;

  // Derived state
  const filteredCouponTypes = filterCoupons(
    couponTypesData,
    filterType,
    searchTerm
  );
  const totalPages = Math.ceil(filteredCouponTypes.length / couponsPerPage);
  const currentCouponTypes = paginateCoupons(
    filteredCouponTypes,
    currentPage,
    couponsPerPage
  );

  // Handlers
  const handleGenerateReport = () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error(t("selectDateError"));
      return;
    }

    const requestData = {
      couponType,
      dateFrom: format(dateRange.from, "yyyy-MM-dd"),
      dateTo: format(dateRange.to, "yyyy-MM-dd"),
    };
    console.log("Generating report:", requestData);
  };

  return (
    <div
      className="container mx-0 sm:mx-auto pt-5 pb-6 px-4 space-y-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <DashboardHeader
        t={t}
        topCouponsData={topCouponsData}
        couponTypeOptions={couponTypeOptions}
        dateRange={dateRange}
        setDateRange={setDateRange}
        setCouponType={setCouponType}
        handleGenerateReport={handleGenerateReport}
      />

      <CouponManagementHeader
        t={t}
        filterType={filterType}
        setFilterType={setFilterType}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <CouponGrid coupons={currentCouponTypes} t={t} />

      <CouponPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        t={t}
        dir={locale === "ar" ? "rtl" : "ltr"}
      />
    </div>
  );
}




////////////////////////////
// "use client";
// import { useState } from "react";
// import * as React from "react";
// import Link from "next/link";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationLink,
//   PaginationNext,
// } from "@/components/ui/pagination";
// import Image from "next/image";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CalendarIcon, Filter, Search } from "lucide-react";
// import { format } from "date-fns/format";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";

// const couponTypesData = [
//   {
//     id: 1,
//     name: "Discount Coupon",
//     description: "Percentage or fixed amount discounts",
//     status: "active",
//     addDate: "2023-05-15",
//     couponsCount: 12,
//     image:
//       "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
//   },
//   {
//     id: 2,
//     name: "BOGO",
//     description: "Buy One Get One offers",
//     status: "active",
//     addDate: "2023-06-20",
//     couponsCount: 8,
//     image:
//       "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
//   },
//   {
//     id: 3,
//     name: "Free Shipping",
//     description: "Free delivery offers",
//     status: "active",
//     addDate: "2023-07-10",
//     couponsCount: 15,
//     image:
//       "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
//   },
//   {
//     id: 4,
//     name: "Seasonal Offer",
//     description: "Seasonal promotions",
//     status: "pending",
//     addDate: "2023-08-05",
//     couponsCount: 5,
//     image:
//       "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
//   },
//   {
//     id: 5,
//     name: "Referral Coupon",
//     description: "Referral rewards",
//     status: "expired",
//     addDate: "2023-04-12",
//     couponsCount: 7,
//     image:
//       "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
//   },
//   // Add more types as needed
// ];

// export default function TypesAllCouponsPage() {
//   const [filterType, setFilterType] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [couponType, setCouponType] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateRange, setDateRange] = React.useState<{
//     from: Date | undefined;
//     to: Date | undefined;
//   }>({ from: undefined, to: undefined });
//   const t = useTranslations("Types");
//   const { locale } = useRouter();

//   const couponsPerPage = 10;
//   const totalPages = Math.ceil(couponTypesData.length / couponsPerPage);

//   const filteredCouponTypes = [...couponTypesData]
//     .filter((type) => {
//       // Handle search term
//       if (searchTerm && searchTerm.length > 0) {
//         const matchesSearch =
//           type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           type.description.toLowerCase().includes(searchTerm.toLowerCase());
//         if (!matchesSearch) return false;
//       }

//       // Handle status filters
//       if (["active", "expired", "pending"].includes(filterType)) {
//         return type.status === filterType;
//       }

//       return true;
//     })
//     .sort((a, b) => {
//       if (filterType === "newest") {
//         return new Date(b.addDate).getTime() - new Date(a.addDate).getTime();
//       } else if (filterType === "oldest") {
//         return new Date(a.addDate).getTime() - new Date(b.addDate).getTime();
//       }
//       return 0;
//     });

//   const currentCouponTypes = filteredCouponTypes.slice(
//     (currentPage - 1) * couponsPerPage,
//     currentPage * couponsPerPage
//   );

//   const handleGenerateReport = async () => {
//     if (!dateRange.from || !dateRange.to) {
//       toast.error("Please select a date range");
//       return;
//     }

//     const requestData = {
//       couponType: couponType || null,
//       dateFrom: format(dateRange.from, "yyyy-MM-dd"),
//       dateTo: format(dateRange.to, "yyyy-MM-dd"),
//     };
//     console.log("Generating report with:", requestData);
//   };

//   const topCouponsData = [
//     { rank: 1, couponType: "Discount Coupon", sales: "$1,200" },
//     { rank: 2, couponType: "BOGO", sales: "$800" },
//     { rank: 3, couponType: "Free Shipping", sales: "$500" },
//     { rank: 4, couponType: "Free Shipping", sales: "$500" },
//     { rank: 5, couponType: "Free Shipping", sales: "$500" },
//   ];

//   const couponTypeOptions = [
//     { label: "Discount Coupon", value: "discount" },
//     { label: "BOGO", value: "bogo" },
//     { label: "Free Shipping", value: "free_shipping" },
//     { label: "Seasonal Offer", value: "seasonal" },
//     { label: "Referral Coupon", value: "referral" },
//     { label: "New Customer Coupon", value: "new_customer" },
//   ];

//   return (
//     <div className="container mx-0 sm:mx-auto pt-5 pb-6 px-4 space-y-4">
//       {/* Section 1: Top Coupons and Report Generator */}
//       <div className="flex flex-col lg:flex-row gap-4 w-full">
//         <Card className="w-full lg:w-2/5 p-4 flex gap-4">
//           <CardTitle className="text-lg text-primary mb-1">
//             {t("topCoupons")}
//           </CardTitle>
//           <div className="space-y-4">
//             <Table className="min-w-full text-sm">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="py-2 px-4 text-start">
//                     {t("rank")}
//                   </TableHead>
//                   <TableHead className="py-2 px-4 text-start">
//                     {t("couponType")}
//                   </TableHead>
//                   <TableHead className="py-2 px-4 text-start">
//                     {t("sales")}
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {topCouponsData.map((row, index) => (
//                   <TableRow key={index} className="hover:bg-secondary">
//                     <TableCell className="py-2 px-4">{row.rank}</TableCell>
//                     <TableCell className="py-2 px-4">
//                       {row.couponType}
//                     </TableCell>
//                     <TableCell className="py-2 px-4">{row.sales}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </Card>

//         <div className="w-full lg:w-3/5 flex flex-col gap-4">
//           <Card className="w-full h-full p-4">
//             <CardTitle className="text-lg text-primary mb-1">
//               {t("generateReport")}
//             </CardTitle>
//             <div className="space-y-4">
//               <div className="space-y-4 w-full">
//                 <Label htmlFor="couponType">{t("couponType")}</Label>
//                 <Select onValueChange={(val) => setCouponType(val)}>
//                   <SelectTrigger className="w-full" id="couponType">
//                     <SelectValue placeholder={t("selectType")} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {couponTypeOptions.map((type) => (
//                       <SelectItem key={type.value} value={type.value}>
//                         {type.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-4">
//                 <Label>{t("selectDate")}</Label>
//                 <div className="flex gap-2">
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant={"outline"}
//                         className="w-full justify-start text-left font-normal"
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4 opacity-70 shrink-0 " />
//                         {dateRange?.from ? (
//                           dateRange?.to ? (
//                             <>
//                               {format(dateRange.from, "MMM dd, yyyy")} -{" "}
//                               {format(dateRange.to, "MMM dd, yyyy")}
//                             </>
//                           ) : (
//                             format(dateRange.from, "MMM dd, yyyy")
//                           )
//                         ) : (
//                           <span className="text-muted-foreground">
//                             {t("selectDate")}
//                           </span>
//                         )}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="range"
//                         selected={dateRange}
//                         onSelect={(range: any) => {
//                           if (range) {
//                             setDateRange({
//                               from: range.from,
//                               to: range.to,
//                             });
//                           }
//                         }}
//                         numberOfMonths={2}
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </div>

//               <Button className="w-full mt-2" onClick={handleGenerateReport}>
//                 {t("generateReport")}
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* Section 2: Coupon Types Management */}
//       <Card>
//         <CardHeader className="flex flex-col sm:flex-row align-center justify-between space-y-0">
//           <div>
//             <CardTitle> {t("title")}</CardTitle>
//             <CardDescription> {t("description")}</CardDescription>
//           </div>
//           <div className="flex space-x-2">
//             <div className="relative">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="cursor-pointer text-muted-foreground"
//                 onClick={() => {
//                   const el = document.getElementById("filter-menu");
//                   if (el) el.classList.toggle("hidden");
//                 }}
//               >
//                 <Filter className="mr-2 h-4 w-4" />
//                 {t("filter")}
//               </Button>
//               <div
//                 id="filter-menu"
//                 className="cursor-pointer absolute right-0 z-10 mt-2 w-40 bg-secondary border rounded shadow hidden"
//               >
//                 {[
//                   { label: t("newest"), value: "newest" },
//                   { label: t("oldest"), value: "oldest" },
//                   { label: t("active"), value: "active" },
//                   { label: t("expired"), value: "expired" },
//                   { label: t("pending"), value: "pending" },
//                 ].map((item) => (
//                   <button
//                     key={item.value}
//                     className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-200 ${
//                       filterType === item.value ? "bg-gray-200" : ""
//                     }`}
//                     onClick={() => {
//                       setFilterType(item.value);
//                       setCurrentPage(1);
//                       const el = document.getElementById("filter-menu");
//                       if (el) el.classList.add("hidden");
//                     }}
//                   >
//                     {item.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="relative ">
//               <Input
//                 type="text"
//                 placeholder={t("search")}
//                 className="h-8 max-w-[200px] "
//                 onChange={(e) => {
//                   const searchTerm = e.target.value;
//                   setSearchTerm(searchTerm);
//                   setCurrentPage(1);
//                 }}
//               />
//               <Search className="absolute end-2 top-2 h-4 w-4 text-muted-foreground" />
//             </div>
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Section 3: Coupon Types Grid View */}
//       <Card>
//         <CardContent>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
//             {currentCouponTypes.map((type) => (
//               <Card
//                 key={type.id}
//                 className="overflow-hidden hover:shadow-md transition-shadow p-0"
//               >
//                 <div className="relative w-full h-32">
//                   <Image
//                     src={type.image}
//                     alt={type.name}
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="absolute bottom-1 start-1  bg-background/90 px-2 py-0.5 rounded text-xs">
//                     <span className="text-primary font-bold">
//                       {type.couponsCount} {t("coupons")}
//                     </span>
//                   </div>
//                 </div>
//                 <CardHeader className="py-0 px-3">
//                   <CardTitle className="text-lg">{type.name}</CardTitle>
//                   <CardDescription className="flex justify-between items-center text-xs">
//                     <span className="line-clamp-1 text-ellipsis overflow-hidden">
//                       {type.description}
//                     </span>{" "}
//                     <span
//                       className={`px-2 py-0.5 rounded-full ${
//                         type.status === "active"
//                           ? "bg-green-100 text-green-800"
//                           : type.status === "expired"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {t(type.status)}
//                     </span>
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent className="py-1 px-3">
//                   <div className="flex justify-between text-xs">
//                     <span>
//                       {t("added")} :{" "}
//                       {format(new Date(type.addDate), "MMM dd, yyyy")}
//                     </span>
//                   </div>
//                 </CardContent>

//                 <CardFooter className="px-3 pb-3 flex justify-center gap-2">
//                   <Button
//                     variant="outline"
//                     className="w-1/2 h-8 text-xs"
//                     asChild
//                   >
//                     <Link href={`/dashboard/coupons/types/${type.id}`}>
//                       {t("details")}
//                     </Link>
//                   </Button>
//                   <Button className="w-1/2 h-8 text-xs" asChild>
//                     <Link href={`/dashboard/coupons/new?type=${type.id}`}>
//                       {t("addCoupon")}
//                     </Link>
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </CardContent>

//         {/* Pagination */}
//         <CardFooter className="flex justify-center">
//           <Pagination>
//             <PaginationContent dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//               <PaginationItem>
//                 <PaginationPrevious
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage > 1) setCurrentPage(currentPage - 1);
//                   }}
//                 >
//                   {t("previous")}
//                 </PaginationPrevious>
//               </PaginationItem>
//               {Array.from({ length: totalPages }).map((_, index) => (
//                 <PaginationItem key={index}>
//                   <PaginationLink
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCurrentPage(index + 1);
//                     }}
//                     isActive={currentPage === index + 1}
//                   >
//                     {index + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}
//               <PaginationItem>
//                 <PaginationNext
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage < totalPages)
//                       setCurrentPage(currentPage + 1);
//                   }}
//                   aria-label={t("next")}
//                 >
//                   {t("next")}
//                 </PaginationNext>
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
