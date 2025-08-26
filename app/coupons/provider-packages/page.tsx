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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PACKAGES_PER_PAGE = 10;

const editFormSchema = z.object({
  title: z.string().min(1, { message: "titleRequired" }),
  description: z.string().min(1, { message: "descriptionRequired" }),
  from_date: z.string().min(1, { message: "startDateRequired" }),
  to_date: z.string().min(1, { message: "endDateRequired" }),
  max_providers: z.string().min(1, { message: "maxProvidersRequired" }),
  max_price: z.string().min(1, { message: "maxPriceRequired" }),
  max_amount: z.string().min(1, { message: "maxAmountRequired" }),
  max_coupons_number: z
    .string()
    .min(1, { message: "maxCouponsNumberRequired" }),
  file: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "invalidFile",
    }),
});

const AddCouponToPackageDialog = ({ pkg, refreshPackages, t }) => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        coupon_id: z.string().min(1, { message: "couponRequired" }),
        value: z.string().min(1, { message: "valueRequired" }),
      })
    ),
    defaultValues: {
      coupon_id: "",
      value: "",
    },
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          "http://164.92.67.78:3002/api/coupons/all"
        );
        const { data } = response.data;
        if (data && Array.isArray(data)) {
          setCoupons(data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error(t("fetchCouponsError"), { duration: 5000 });
      }
    };
    fetchCoupons();
  }, [t]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await axios.post("http://164.92.67.78:3002/api/coupon_packages/create", {
        package_id: pkg.id,
        coupon_id: values.coupon_id,
        value: values.value,
      });
      toast.success(t("addCouponSuccessDesc"), {
        description: t("addCouponSuccess"),
        duration: 3000,
      });
      refreshPackages();
      form.reset();
    } catch (error) {
      console.error("Error adding coupon to package:", error);
      toast.error(t("addCouponErrorDesc"), {
        description: error.response?.data?.message || t("addCouponError"),
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("addCoupon")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("addCoupon")}</DialogTitle>
          <DialogDescription>{t("addCouponDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="coupon_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("coupon")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCoupon")} />
                        </SelectTrigger>
                        <SelectContent>
                          {coupons.map((coupon) => (
                            <SelectItem
                              key={coupon.id}
                              value={coupon.id.toString()}
                            >
                              {coupon.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("value")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("valuePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">{t("cancel")}</Button>
                </DialogTrigger>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("addCoupon")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditPackageDialog = ({ pkg, refreshPackages, t }) => {
  const form = useForm({
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
      max_providers:
        pkg?.package_settings?.find((s) => s.criteria.name === "MaxProviders")
          ?.value || "",
      max_price:
        pkg?.package_settings?.find((s) => s.criteria.name === "MaxPrice")
          ?.value || "",
      max_amount:
        pkg?.package_settings?.find((s) => s.criteria.name === "MaxAmount")
          ?.value || "",
      max_coupons_number:
        pkg?.package_settings?.find(
          (s) => s.criteria.name === "MaxCouponsNumber"
        )?.value || "",
      file: null,
    },
  });

  async function onSubmit(values) {
    try {


      await axios.put(
        `http://164.92.67.78:3002/api/packages/${pkg.id}`,
        {
          from_date: values.from_date,
          to_date: values.to_date,
          amount: values.amount,
          status: values.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
          console.log(error.response.data);
          toast.error(
            `${t("editErrorDesc")}: ${
              error.response.data.message || t("editError")
            }`,
            { duration: 7000 }
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
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("editPackage")}</DialogTitle>
          <DialogDescription>{t("editPackageDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Title */}
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

              {/* Description */}
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

              {/* From Date */}
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

              {/* To Date */}
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

              {/* Max Providers */}
              <FormField
                control={form.control}
                name="max_providers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxProviders")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("maxProvidersPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Price */}
              <FormField
                control={form.control}
                name="max_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxPrice")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("maxPricePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Amount */}
              <FormField
                control={form.control}
                name="max_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxAmount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("maxAmountPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Coupons Number */}
              <FormField
                control={form.control}
                name="max_coupons_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxCouponsNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("maxCouponsNumberPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File */}
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

              {/* Buttons */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PackageDetailsModal = ({
  pkg,
  t,
  open,
  onOpenChange,
  refreshPackages,
}) => {
  if (!pkg) return null;

  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <div className="relative w-full h-64 mt-4">
            <MyImage src={pkg.image} alt={pkg.title} />
          </div>
          <DialogTitle>{pkg.title}</DialogTitle>
          <DialogDescription>{pkg.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 px-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">{t("id")}</h4>
                <p className="text-sm text-muted-foreground">{pkg.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">{t("provider")}</h4>
                <p className="text-sm text-muted-foreground">{pkg.provider}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">{t("status")}</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {t(pkg.status)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">{t("startDate")}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(pkg.fromDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">{t("endDate")}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(pkg.toDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">{t("amount")}</h4>
                <p className="text-sm text-muted-foreground">{pkg.amount}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">{t("averageRating")}</h4>
                <p className="text-sm text-muted-foreground">
                  {pkg.average_rating}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">{t("totalPrice")}</h4>
                <p className="text-sm text-muted-foreground">
                  {pkg.total_price}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("coupons")}</h4>
              {pkg.coupons.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("noCouponsFound")}
                </p>
              ) : (
                <div className="mt-2 w-full overflow-x-auto">
                  <Table dir={isRTL ? "rtl" : "ltr"} className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("couponName")}</TableHead>
                        <TableHead>{t("description")}</TableHead>
                        <TableHead>{t("price")}</TableHead>
                        <TableHead>{t("amount")}</TableHead>
                        <TableHead>{t("couponCode")}</TableHead>
                        <TableHead>{t("date")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pkg.coupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell>{coupon.name}</TableCell>
                          <TableCell>
                            {coupon.description.length > 50
                              ? coupon.description.slice(0, 50) + "..."
                              : coupon.description}
                          </TableCell>
                          <TableCell>{coupon.price}</TableCell>
                          <TableCell>{coupon.amount}</TableCell>
                          <TableCell>{coupon.coupon_code}</TableCell>
                          <TableCell>
                            {new Date(coupon.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("packageSettings")}</h4>
              {pkg.package_settings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("noSettingsFound")}
                </p>
              ) : (
                <ul className="text-sm text-muted-foreground">
                  {pkg.package_settings.map((setting) => (
                    <li key={setting.id}>
                      {t(setting.criteria.name)}: {setting.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-start">
              <AddCouponToPackageDialog
                pkg={pkg}
                refreshPackages={refreshPackages}
                t={t}
              />
            </div>
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
    [t]
  );

  const displayedData = useMemo(
    () => (isRTL ? [...packages].reverse() : packages),
    [packages, isRTL]
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
      selectedPackages.includes(pkg.id)
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
        refreshPackages={refreshPackages}
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
                  : "selectAll"
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
                              selectedPackages
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
  selectedPackages
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
          <EditPackageDialog
            pkg={pkg}
            refreshPackages={refreshPackages}
            t={t}
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

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }
  };

  const handleSelectPackage = (id) => {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((pkgId) => pkgId !== id) : [...prev, id]
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
          }
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
        }
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
