"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import { Filter, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import debounce from "lodash/debounce";
import {
  fetchSeasonalEvents,
  fetchCoupons,
  fetchPackages,
  addItemToEvent,
} from "./constants";
import MyImage from "@/components/my-image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVENTS_PER_PAGE = 10;

const itemSchema = z.object({
  type: z.enum(["coupon", "package"], { message: "typeRequired" }),
  eventable_id: z.string().min(1, { message: "itemRequired" }),
  count: z
    .string()
    .min(1, { message: "countRequired" })
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "invalidCount",
    }),
});

const AddItemDialog = ({ eventId, refreshEvents, t }) => {
  const [coupons, setCoupons] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      type: "coupon",
      eventable_id: "",
      count: "",
    },
  });

  useEffect(() => {
    const loadItems = async () => {
      setIsLoadingItems(true);
      try {
        const [fetchedCoupons, fetchedPackages] = await Promise.all([
          fetchCoupons(),
          fetchPackages(),
        ]);
        setCoupons(fetchedCoupons);
        setPackages(fetchedPackages);
      } catch (error) {
        toast.error(t("fetchItemsErrorDesc"), {
          description: t("fetchItemsError"),
        });
      } finally {
        setIsLoadingItems(false);
      }
    };
    loadItems();
  }, [t]);

  async function onSubmit(values: z.infer<typeof itemSchema>) {
    try {
      const itemData = {
        seasonal_events_id: eventId,
        eventable_id: parseInt(values.eventable_id),
        eventable_type: values.type,
        count: parseInt(values.count),
      };

      const { success, error } = await addItemToEvent(eventId, itemData);

      if (success) {
        toast.success(t("addItemSuccessDesc"), {
          description: t("addItemSuccess"),
        });
        refreshEvents();
        form.reset();
      } else {
        throw error;
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(t("addItemErrorDesc"), {
        description: t("addItemError"),
      });
    }
  }

  const type = form.watch("type");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-primary underline hover:text-primary/80 p-0 h-auto"
        >
          {t("addItem")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addItem")}</DialogTitle>
          <DialogDescription>{t("addItemDesc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("type")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingItems}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger
                        className="w-full"
                        dir={useLocale() === "ar" ? "rtl" : "ltr"}
                      >
                        <SelectValue placeholder={t("selectTypePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="coupon">{t("coupon")}</SelectItem>
                      <SelectItem value="package">{t("package")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventable_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("item")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingItems || (type === "coupon" ? coupons.length === 0 : packages.length === 0)}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger
                        className="w-full"
                        dir={useLocale() === "ar" ? "rtl" : "ltr"}
                      >
                        <SelectValue placeholder={t("selectItemPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {type === "coupon"
                        ? coupons.map((coupon) => (
                            <SelectItem key={coupon.id} value={coupon.id.toString()}>
                              {coupon.name} ({coupon.couponCode})
                            </SelectItem>
                          ))
                        : packages.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id.toString()}>
                              {pkg.title} ({t("price")}: {pkg.total_price})
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("count")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder={t("countPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogTrigger>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isLoadingItems}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("addItem")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const EventDetailsModal = ({ event, t, open, onOpenChange }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative w-full h-64 mt-4">
            <MyImage src={event.image} alt={event.title} />
          </div>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("userId")}</h4>
              <p className="text-sm text-muted-foreground">{event.userId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("status")}</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {t(event.status)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("startDate")}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(event.fromDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("endDate")}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(event.toDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("couponsCount")}</h4>
            <p className="text-sm text-muted-foreground">
              {event.couponsCount}
            </p>
          </div>
          {event.coupons.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">{t("items")}</h4>
              <ul className="text-sm text-muted-foreground">
                {event.coupons.map((item) => (
                  <li key={item.id}>
                    {item.name} ({t(item.couponCode === "N/A" ? "package" : "coupon")}: {item.couponCode !== "N/A" ? item.couponCode : t("price") + ": " + item.price})
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

const EventsTable = ({
  t,
  events,
  currentPage,
  setCurrentPage,
  totalPages,
  refreshEvents,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedEvent, setSelectedEvent] = useState(null);

  const columns = useMemo(
    () => [
      { key: "image", label: t("image") || "Image" },
      { key: "title", label: t("title") || "Title" },
      { key: "dateRange", label: t("dateRange") || "Date Range" },
      { key: "status", label: t("status") || "Status" },
      { key: "couponsCount", label: t("couponsCount") || "Coupons Count" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t]
  );

  const displayedData = useMemo(
    () => (isRTL ? [...events].reverse() : events),
    [events, isRTL]
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <EventDetailsModal
        event={selectedEvent}
        t={t}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
      <Card className="shadow-none">
        <CardContent className="p-x-2">
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
                        {t("noEventsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((event) => (
                      <TableRow
                        key={event.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${event.id}-${column.key}`}
                            className={`px-4 py-3 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {renderTableCellContent(
                              event,
                              column.key,
                              isRTL,
                              t,
                              formatDate,
                              setSelectedEvent,
                              refreshEvents
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
  event,
  key,
  isRTL,
  t,
  formatDate,
  setSelectedEvent,
  refreshEvents
) {
  switch (key) {
    case "image":
      return (
        <div className="relative w-9 h-10 cursor-pointer">
          <MyImage src={event.image} alt={event.title} />
        </div>
      );
    case "title":
      return <span className="font-medium">{event.title}</span>;
    case "dateRange":
      return (
        <span>
          {formatDate(event.fromDate)} - {formatDate(event.toDate)}
        </span>
      );
    case "status":
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            event.status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {t(event.status)}
        </span>
      );
    case "couponsCount":
      return <span>{event.couponsCount}</span>;
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedEvent(event)}
          >
            {t("viewDetails")}
          </Button>
          <AddItemDialog
            eventId={event.id}
            refreshEvents={refreshEvents}
            t={t}
          />
        </div>
      );
    default:
      return null;
  }
}

export default function SeasonalEventsProviderPage() {
  const t = useTranslations("SeasonalEventsProvider");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 300),
    []
  );

  const fetchEventsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        events,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchSeasonalEvents(currentPage, EVENTS_PER_PAGE);
      console.log(
        "Fetched events:",
        events,
        "Total pages:",
        totalPages,
        "Current page:",
        apiCurrentPage
      );
      if (!Array.isArray(events)) {
        throw new Error("Events data is not an array");
      }
      setEvents(events);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchEventsData:", {
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
      setEvents([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, t]);

  useEffect(() => {
    console.log(
      "Fetching events for page:",
      currentPage,
      "Search:",
      searchTerm,
      "Filter:",
      filterType
    );
    fetchEventsData();
  }, [fetchEventsData, currentPage, searchTerm, filterType]);

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
                      { label: t("inactive"), value: "inactive" },
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
          <EventsTable
            t={t}
            events={events}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            refreshEvents={fetchEventsData}
          />
        </>
      )}
    </div>
  );
}