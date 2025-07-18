"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
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
import { Filter, Plus, Search, Play, Trash2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import debounce from "lodash/debounce";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ViewportBoundary } from "next/dist/server/app-render/entry-base";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import AddReelDialog from "./AddReelDialog";
import { Checkbox } from "@/components/ui/checkbox";

import  api  from "@/lib/api"; // Import your preconfigured api
import { toast } from "sonner";

const REELS_PER_PAGE = 10;

const fetcher = (url) => api.get(url).then((res) => res.data);

const SummaryCards = ({ t }) => {
  const summaries = [
    { title: t("activeReels"), value: "24,560", change: "+8% from last month" },
    {
      title: t("monthlyViews"),
      value: "24,560",
      change: "+8% from last month",
    },
    { title: t("totalReels"), value: "24,560", change: "+8% from last month" },
  ];

  return (
    <Card className="w-full lg:w-3/5 p-4 hidden md:flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {summaries.map((summary, index) => (
          <div key={index} className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h2>{summary.title}</h2>
              <h4 className="text-2xl">{summary.value}</h4>
            </div>
            <span className="text-sm text-green-500 mt-2">
              {summary.change}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MobileSummaryCards = ({ t }) => {
  const summaries = [
    { title: t("activeReels"), value: "24,560", change: "+8% from last month" },
    {
      title: t("monthlyViews"),
      value: "24,560",
      change: "+8% from last month",
    },
    { title: t("totalReels"), value: "24,560", change: "+8% from last month" },
  ];

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {summaries.map((summary, index) => (
        <Card key={index} className="w-full p-4 flex flex-col justify-between">
          <div>
            <h2>{summary.title}</h2>
            <h4 className="text-2xl">{summary.value}</h4>
          </div>
          <span className="text-sm text-green-500 mt-2">{summary.change}</span>
        </Card>
      ))}
    </div>
  );
};

const NavigationCards = ({ t }) => {
  return (
    <div className="w-full lg:w-2/5 flex flex-col sm:flex-row sm:grid-cols-2 md:grid-cols-1 gap-4">
      <Link href="/dashboard/top-reels" className="block">
        <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-6">
          <CardTitle className="text-lg text-primary mb-1">
            {t("seeTopReels")}
          </CardTitle>
          <CardDescription>{t("seeTopReelsDesc")}</CardDescription>
        </Card>
      </Link>
      <Link href="/dashboard/top-views" className="block">
        <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-6">
          <CardTitle className="text-lg text-primary mb-1">
            {t("seeTopViews")}
          </CardTitle>
          <CardDescription>{t("seeTopViewsDesc")}</CardDescription>
        </Card>
      </Link>
    </div>
  );
};

const ReelsGrid = ({
  t,
  reels,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedReels,
  setSelectedReels,
  mutate,
}) => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectReel = (id) => {
    setSelectedReels((prev) =>
      prev.includes(id) ? prev.filter((reelId) => reelId !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const allSelected = reels.every((reel) => selectedReels.includes(reel.id));
    setSelectedReels(allSelected ? [] : reels.map((reel) => reel.id));
  };

  const handleDeleteSelected = async () => {
    if (selectedReels.length === 0) return;

    try {
      setIsDeleting(true);
      
      // Delete each reel individually
      await Promise.all(
        selectedReels.map(id => 
          api.delete(`/reels/${id}`)
            .catch(error => {
              console.error(`Failed to delete reel ${id}:`, error);
              throw error;
            })
        )
      );

      toast(
        t("deleteSuccess"),
      );

      setSelectedReels([]);
      mutate(); // Refresh the reels list
    } catch (error) {
      toast(
 t("deleteError"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePlayVideo = (reel) => {
    setPlayingVideo(reel);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-2">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleToggleSelectAll}
              disabled={reels.length === 0}
            >
              {t(
                selectedReels.length === reels.length && reels.length > 0
                  ? "deselectAll"
                  : "selectAll"
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={selectedReels.length === 0 || isDeleting}
            >
              {isDeleting ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {t("deleteSelected")}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {reels.map((reel) => (
              <Card
                key={reel.id}
                className="w-full p-1 flex flex-col justify-between relative"
              >
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedReels.includes(reel.id)}
                    onCheckedChange={() => handleSelectReel(reel.id)}
                    className="h-5 w-5 rounded-full border-2 border-white bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="relative">
                  <Image
                    src="/event.jpg"
                    alt="s"
                    width={1920}
                    height={1080}
                    className="object-cover rounded-xl"
                  />
                  <Button
                    className="absolute inset-0 flex items-center justify-center w-full h-full p-0 bg-opacity-0 rounded-xl hover:bg-black hover:opacity-50 duration-300"
                    onClick={() => handlePlayVideo(reel)}
                  >
                    <Play className="w-96 h-96 text-white " strokeWidth={6} />
                  </Button>
                </div>
                <div className="flex gap-1.5">
                  <Avatar>
                    <AvatarImage
                      src={
                        reel.provider.profile_image ||
                        "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>{}</AvatarFallback>
                  </Avatar>
                  <h2 className="line-clamp-2 overflow-ellipsis">
                    {reel.reel.name}
                  </h2>
                </div>
                <p className="-mt-4 ms-9 line-clamp-2 overflow-ellipsis font-xs text-muted-foreground">
                  {reel.description}
                </p>
              </Card>
            ))}
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
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                >
                  {t("next")}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
      {playingVideo && (
        <Dialog open={!!playingVideo} onOpenChange={handleCloseVideo}>
          <DialogContent
            showCloseButton={false}
            className="p-0 border-0 bg-transparent flex items-center max-w-[60vh] justify-center max-h-[90vh]"
          >
            <div
              className="relative w-full max-w-[60vh] max-h-[95svh]"
              style={{ aspectRatio: "9/16" }}
            >
              <video
                src={`https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com/${playingVideo.reel.path}`}
                autoPlay
                controls
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="flex absolute bottom-16 left-3 ">
                <div className="  text-white bg-black backdrop-blur-2xl opacity-90 px-2 py-1 rounded mx-1">
                  by: {playingVideo.provider.name || "Unknown"}
                </div>
                <Avatar>
                  <AvatarImage
                    src={
                      playingVideo.provider.profile_image ||
                      "https://github.com/shadcn.png"
                    }
                  />
                </Avatar>
              </div>

              <Button
                variant="ghost"
                className="absolute top-2 right-2 text-white bg-accent bg-opacity-90"
                onClick={handleCloseVideo}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default function AllReelsPage() {
  const t = useTranslations("Reels");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedReels, setSelectedReels] = useState([]);

  const { data, error, isLoading, mutate } = useSWR(
    `/reels/index?page=${currentPage}`,
    fetcher
  );
  const reels = data?.data?.data || [];
  const totalPages = data?.data?.last_page || 1;

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const filteredReels = useMemo(() => {
    return reels
      .filter((reel) => {
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          return (
            reel.reel.name.toLowerCase().includes(lowerSearch) ||
            reel.description.toLowerCase().includes(lowerSearch)
          );
        }
        return true;
      })
      .filter((reel) => {
        if (["active", "expired", "pending"].includes(filterType)) {
          return reel.status === filterType;
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

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("active"), value: "active" },
    { label: t("expired"), value: "expired" },
    { label: t("pending"), value: "pending" },
  ];

  if (error) return <div>Error loading reels</div>;
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <SummaryCards t={t} />
        <NavigationCards t={t} />
        <MobileSummaryCards t={t} />
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
                className="text-muted-foreground"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {t("filter")}
              </Button>
              {isFilterMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-40 bg-secondary border rounded shadow">
                  {filterOptions.map((item) => (
                    <button
                      key={item.value}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-100 ${
                        filterType === item.value
                          ? "bg-gray-200 dark:bg-gray-100"
                          : ""
                      }`}
                      onClick={() => {
                        setFilterType(item.value);
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
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
              <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
            </div>

            <AddReelDialog t={t} refreshReels={mutate} />
          </div>
        </CardHeader>
      </Card>
      <ReelsGrid
        t={t}
        reels={filteredReels}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        selectedReels={selectedReels}
        setSelectedReels={setSelectedReels}
        mutate={mutate}
      />
    </div>
  );
}