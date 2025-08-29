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
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for system preference and watch for changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!event) return null;

  // Helper variables for dark/light mode
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-800";
  const textMutedColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "active":
        return isDarkMode 
          ? `${baseClasses} bg-green-900/30 text-green-300` 
          : `${baseClasses} bg-green-100 text-green-800`;
      case "inactive":
        return isDarkMode 
          ? `${baseClasses} bg-red-900/30 text-red-300` 
          : `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return isDarkMode 
          ? `${baseClasses} bg-yellow-900/30 text-yellow-300` 
          : `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return isDarkMode 
          ? `${baseClasses} bg-gray-800 text-gray-300` 
          : `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[650px] max-h-[85vh] overflow-y-auto p-0 ${bgColor}`}>
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white">
            <DialogHeader className="space-y-2">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
                <span className={getStatusBadge(event.status)}>
                  {t(event.status)}
                </span>
              </div>
              <DialogDescription className="text-teal-100">
                {event.description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            {/* Event Image */}
            <div className="relative w-full h-72 rounded-lg overflow-hidden mb-6 shadow-md">
              <MyImage 
                src={event.image} 
                alt={event.title} 
                className="object-cover w-full h-full"
              />
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <DetailCard 
                title={t("userId")} 
                value={event.userId} 
                icon="fa-user"
                isDarkMode={isDarkMode}
              />
              <DetailCard 
                title={t("status")} 
                value={t(event.status)} 
                icon="fa-info-circle"
                isDarkMode={isDarkMode}
              />
              <DetailCard 
                title={t("startDate")} 
                value={new Date(event.fromDate).toLocaleDateString()} 
                icon="fa-calendar-day"
                isDarkMode={isDarkMode}
              />
              <DetailCard 
                title={t("endDate")} 
                value={new Date(event.toDate).toLocaleDateString()} 
                icon="fa-calendar-check"
                isDarkMode={isDarkMode}
              />
              <DetailCard 
                title={t("couponsCount")} 
                value={event.couponsCount} 
                icon="fa-ticket-alt"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Coupons List */}
            {event.coupons.length > 0 && (
              <div className="mb-4">
                <h4 className={`text-lg font-semibold mb-3 flex items-center ${textColor}`}>
                  <i className="fas fa-tags mr-2 text-teal-500"></i>
                  {t("items")}
                </h4>
                <div className="space-y-3">
                  {event.coupons.map((item) => (
                    <div key={item.id} className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${textColor}`}>{item.name}</p>
                          <div className="flex items-center mt-2">
                            <span className={`text-sm ${item.couponCode === "N/A" ? 'bg-teal-500' : 'bg-teal-600'} text-white px-2 py-1 rounded-md mr-2`}>
                              {t(item.couponCode === "N/A" ? "package" : "coupon")}
                            </span>
                            {item.couponCode !== "N/A" ? (
                              <span className={`text-sm ${textMutedColor}`}>
                                {item.couponCode}
                              </span>
                            ) : (
                              <span className={`text-sm ${textMutedColor}`}>
                                {t("price")}: {item.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <i className={`fas ${item.couponCode === "N/A" ? 'fa-box' : 'fa-ticket-alt'} text-teal-500`}></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for detail items
const DetailCard = ({ title, value, icon, isDarkMode = false }) => {
  const cardBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const textMutedColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  
  return (
    <div className={`${cardBgColor} p-4 rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
      <div className="flex items-center mb-2">
        <div className="bg-teal-100 text-teal-600 p-2 rounded-md mr-3">
          <i className={`fas ${icon} text-sm`}></i>
        </div>
        <h4 className={`text-sm font-medium ${textMutedColor}`}>{title}</h4>
      </div>
      <p className={`text-base font-semibold ${textColor} pl-11`}>{value || "N/A"}</p>
    </div>
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
    return new Date(date).toLocaleDateString("en-US", {
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
                  {/* <Button
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
                  </Button> */}
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
                {/* <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("search")}
                    className="h-8 max-w-[200px]"
                    onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
                </div> */}
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