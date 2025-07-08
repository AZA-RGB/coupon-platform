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
import { Button } from "@/components/ui/button";
import { Filter, Search, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import debounce from "lodash/debounce";
import { fetchReels, addReel, deleteReel } from "./constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
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

const REELS_PER_PAGE = 10;

const addReelSchema = z.object({
  description: z.string().min(1, { message: "descriptionRequired" }),
  file: z.any().refine((file) => file instanceof File, { message: "fileRequired" }),
});

const AddReelDialog = ({ refreshReels, t }) => {
  const form = useForm<z.infer<typeof addReelSchema>>({
    resolver: zodResolver(addReelSchema),
    defaultValues: {
      description: "",
      file: null,
    },
  });

  async function onSubmit(values: z.infer<typeof addReelSchema>) {
    try {
      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("file", values.file);

      const { success, error } = await addReel(formData);

      if (success) {
        toast.success(t("addReelSuccessDesc"), {
          description: t("addReelSuccess"),
        });
        refreshReels();
        form.reset();
      } else {
        throw error;
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(t("addReelErrorDesc"), {
        description: t("addReelError"),
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("addReel")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("addReel")}</DialogTitle>
          <DialogDescription>{t("addReelDesc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("descriptionPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("file")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => field.onChange(e.target.files?.[0] || null)}
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
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("addReel")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const ReelDetailsDialog = ({ reel, t, open, onOpenChange }) => {
  if (!reel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{reel.description}</DialogTitle>
          <DialogDescription>{t("reelDetailsDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative w-full h-64">
            {reel.fileType === 1 ? (
              <video
                src={encodeURI(reel.media)}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={encodeURI(reel.media)}
                alt={reel.description}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("providerId")}</h4>
              <p className="text-sm text-muted-foreground">{reel.providerId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("providerName")}</h4>
              <p className="text-sm text-muted-foreground">{reel.providerName}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("date")}</h4>
            <p className="text-sm text-muted-foreground">{new Date(reel.date).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("description")}</h4>
            <p className="text-sm text-muted-foreground">{reel.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReelsGrid = ({ t, reels, currentPage, setCurrentPage, totalPages, refreshReels }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedReel, setSelectedReel] = useState(null);

  const handleDeleteReel = async (reelId) => {
    try {
      const { success, error } = await deleteReel(reelId);
      if (success) {
        toast.success(t("deleteReelSuccessDesc"), {
          description: t("deleteReelSuccess"),
        });
        refreshReels();
      } else {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting reel ${reelId}:`, error);
      toast.error(t("deleteReelErrorDesc"), {
        description: t("deleteReelError"),
      });
    }
  };

  return (
    <>
      <ReelDetailsDialog
        reel={selectedReel}
        t={t}
        open={!!selectedReel}
        onOpenChange={(open) => !open && setSelectedReel(null)}
      />
      <Card>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {reels.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {t("noReelsFound")}
              </div>
            ) : (
              reels.map((reel) => (
                <div
                  key={reel.id}
                  className="overflow-hidden transition-shadow p-0 m-0.5 border-0 rounded-none bg-gray-100"
                >
                  <div className="relative w-full h-50">
                    {reel.fileType === 1 ? (
                      <video
                        src={encodeURI(reel.media)}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    ) : (
                      <Image
                        src={encodeURI(reel.media)}
                        alt={reel.description}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium">{reel.description}</p>
                    <p className="text-xs text-muted-foreground">{t("provider")}: {reel.providerName}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="link"
                        className="text-primary underline hover:text-primary/80 p-0 h-auto"
                        onClick={() => setSelectedReel(reel)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        {t("showReel")}
                      </Button>
                      <Button
                        variant="link"
                        className="text-red-600 underline hover:text-red-800 p-0 h-auto"
                        onClick={() => handleDeleteReel(reel.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        {t("deleteReel")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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

export default function ReelsProviderPage() {
  const t = useTranslations("Reels");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [reels, setReels] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const fetchReelsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        reels,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchReels(currentPage, REELS_PER_PAGE);
      console.log("Fetched reels:", reels, "Total pages:", totalPages, "Current page:", apiCurrentPage);
      if (!Array.isArray(reels)) {
        throw new Error("Reels data is not an array");
      }
      setReels(reels);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchReelsData:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      const errorMessage = error.response?.status
        ? `${t("fetchErrorDesc")} (Status ${error.response.status}: ${error.response.data?.message || error.message})`
        : `${t("fetchErrorDesc")} (${error.message})`;
      toast.error(errorMessage, {
        description: t("fetchError"),
        duration: 5000,
      });
      setReels([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, t]);

  useEffect(() => {
    console.log("Fetching reels for page:", currentPage, "Search:", searchTerm, "Filter:", filterType);
    fetchReelsData();
  }, [fetchReelsData, currentPage, searchTerm, filterType]);

  const filteredReels = useMemo(() => {
    return reels
      .filter((reel) => {
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          return reel.description.toLowerCase().includes(lowerSearch);
        }
        return true;
      })
      .sort((a, b) => {
        if (filterType === "newest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (filterType === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return 0;
      });
  }, [reels, searchTerm, filterType]);

  const currentReels = filteredReels.slice(
    (currentPage - 1) * REELS_PER_PAGE,
    currentPage * REELS_PER_PAGE
  );

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
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
                    className="text-muted-foreground"
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
                    className="absolute right-0 z-10 mt-2 w-40 bg-secondary border rounded shadow hidden"
                  >
                    {[
                      { label: t("newest"), value: "newest" },
                      { label: t("oldest"), value: "oldest" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-100 ${
                          filterType === item.value ? "bg-gray-200 dark:bg-gray-100" : ""
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
                <AddReelDialog refreshReels={fetchReelsData} t={t} />
              </div>
            </CardHeader>
          </Card>
          <ReelsGrid
            t={t}
            reels={currentReels}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            refreshReels={fetchReelsData}
          />
        </>
      )}
    </div>
  );
}