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
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search, Play } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { allReelsData } from "./constants";



const REELS_PER_PAGE = 10;

const SummaryCards = ({ t }) => {
  const summaries = [
    { title: t("activeReels"), value: "24,560", change: "+8% from last month" },
    { title: t("monthlyViews"), value: "24,560", change: "+8% from last month" },
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
            <span className="text-sm text-green-500 mt-2">{summary.change}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MobileSummaryCards = ({ t }) => {
  const summaries = [
    { title: t("activeReels"), value: "24,560", change: "+8% from last month" },
    { title: t("monthlyViews"), value: "24,560", change: "+8% from last month" },
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
          <CardTitle className="text-lg text-primarylisten-primary mb-1">{t("seeTopReels")}</CardTitle>
          <CardDescription>{t("seeTopReelsDesc")}</CardDescription>
        </Card>
      </Link>
      <Link href="/dashboard/top-views" className="block">
        <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-6">
          <CardTitle className="text-lg text-primary mb-1">{t("seeTopViews")}</CardTitle>
          <CardDescription>{t("seeTopViewsDesc")}</CardDescription>
        </Card>
      </Link>
    </div>
  );
};

const ReelsGrid = ({ t, reels, currentPage, setCurrentPage, totalPages, selectedReels, setSelectedReels }) => {
  const [playingVideos, setPlayingVideos] = useState({}); // Track which videos are playing

  const handleSelectReel = (id) => {
    setSelectedReels((prev) =>
      prev.includes(id) ? prev.filter((reelId) => reelId !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const allSelected = reels.every((reel) => selectedReels.includes(reel.id));
    setSelectedReels(allSelected ? [] : reels.map((reel) => reel.id));
  };

  const handleDeleteSelected = () => {
    console.log("Deleted reels:", selectedReels);
    setSelectedReels([]);
  };

  const getVideoThumbnail = (mediaUrl) => {
    if (mediaUrl.includes("youtube.com")) {
      const videoId = mediaUrl.split("embed/")[1]?.split("?")[0];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else if (mediaUrl.includes("vimeo.com")) {
      // Note: Vimeo thumbnail requires API call; using placeholder for simplicity
      return "https://via.placeholder.com/480x270?text=Vimeo+Thumbnail";
    }
    return null;
  };

  const handlePlayVideo = (reelId) => {
    setPlayingVideos((prev) => ({ ...prev, [reelId]: true }));
  };

  return (
    <Card>
      <CardContent className="pt-2">
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            onClick={handleToggleSelectAll}
            disabled={reels.length === 0}
          >
            {t(selectedReels.length === reels.length && reels.length > 0 ? "deselectAll" : "selectAll")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedReels.length === 0}
          >
            {t("deleteSelected")}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="overflow-hidden transition-shadow p-0 m-0.5 border-0 rounded-none bg-gray-100"
            >
              <div className="relative w-full h-50">
                {typeof reel.media === "string" ? (
                  playingVideos[reel.id] ? (
                    <iframe
                      src={`${reel.media}?autoplay=1`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={reel.name}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={getVideoThumbnail(reel.media)!}
                        alt={reel.name}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => handlePlayVideo(reel.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                      >
                        <Play className="h-12 w-12 text-white" />
                      </button>
                    </div>
                  )
                ) : (
                  <Image
                    src={reel.media[0]}
                    alt={reel.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
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
  );
};

export default function AllReelsPage() {
  const t = useTranslations("Reels");
  const { locale } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedReels, setSelectedReels] = useState([]);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const filteredReels = useMemo(() => {
    return allReelsData
      .filter((reel) => {
        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          return (
            reel.name.toLowerCase().includes(lowerSearch) ||
            reel.code.toLowerCase().includes(lowerSearch) ||
            reel.type.toLowerCase().includes(lowerSearch)
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
          return new Date(b.addDate).getTime() - new Date(a.addDate).getTime();
        } else if (filterType === "oldest") {
          return new Date(a.addDate).getTime() - new Date(b.addDate).getTime();
        }
        return 0;
      });
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredReels.length / REELS_PER_PAGE);
  const currentReels = filteredReels.slice(
    (currentPage - 1) * REELS_PER_PAGE,
    currentPage * REELS_PER_PAGE
  );

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("active"), value: "active" },
    { label: t("expired"), value: "expired" },
    { label: t("pending"), value: "pending" },
  ];

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 space-y-4">
      {/* Section 1: Summary and Navigation */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <SummaryCards t={t} />
        <NavigationCards t={t} />
        <MobileSummaryCards t={t} />
      </div>

      {/* Section 2: Header with Filter and New Reel */}
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
                        filterType === item.value ? "bg-gray-200 dark:bg-gray-100" : ""
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
            <Button asChild size="sm">
              <Link href="/dashboard/reels/new">
                <Plus className="mr-2 h-4 w-4" />
                {t("newReel")}
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Section 3: Reels Grid */}
      <ReelsGrid
        t={t}
        reels={currentReels}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        selectedReels={selectedReels}
        setSelectedReels={setSelectedReels}
      />
    </div>
  );
}