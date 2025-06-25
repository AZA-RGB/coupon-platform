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
import { Filter, Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import debounce from "lodash/debounce";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./constants";

const CATEGORIES_PER_PAGE = 10;

const CategoriesGrid = ({
  t,
  categories,
  currentPage,
  setCurrentPage,
  totalPages,
  handleEditCategory,
  handleAddCategory,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const displayedData = useMemo(
    () => (isRTL ? [...categories].reverse() : categories),
    [categories, isRTL]
  );

  return (
    <Card className="shadow-none">
      <CardContent className="p-4">
        {displayedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("noCategoriesFound")}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {displayedData.map((cat) => (
              <Card key={cat.id} className="shadow-none flex flex-col">
                <CardContent className="px-4 flex-grow">
                  <div className="flex flex-col h-full">
                    <div className="min-h-[40px]">
                      <h3 className="font-semibold text-lg line-clamp-2 overflow-hidden text-ellipsis">{cat.name}</h3>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="text-sm text-muted-foreground pt-2">
                      {t("providersCount")}: {cat.providers.length}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between px-4 pt-0 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Edit className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          {t("edit")}
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="sm:max-w-md"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("editCategory")}</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogDescription>
                        <Input
                          id={`edit-category-name-${cat.id}`}
                          type="text"
                          defaultValue={cat.name}
                          placeholder={t("namePlaceholder")}
                          className="mb-4"
                        />
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            const input = document.getElementById(
                              `edit-category-name-${cat.id}`
                            );
                            if (input && input.value.trim()) {
                              handleEditCategory(cat.id, input.value.trim());
                            }
                          }}
                        >
                          {t("confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          {t("delete")}
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("confirmDeleteTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("confirmDeleteSingleDesc", { name: cat.name })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleEditCategory(cat.id, null, true)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {t("confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Pagination className="w-full">
          <PaginationContent
            className={`w-full ${isRTL ? "justify-center" : "justify-center"}`}
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
  );
};

export default function CategoriesPage() {
  const t = useTranslations("Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [categories, setCategories] = useState([]);
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

  const fetchCategoriesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        categories,
        totalPages,
        currentPage: apiCurrentPage,
      } = await fetchCategories(
        currentPage,
        CATEGORIES_PER_PAGE,
        searchTerm,
        filterType
      );

      setCategories(categories);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error) {
      console.error("Error in fetchCategoriesData:", error);
      const errorMessage = error.response?.status
        ? `${t("fetchErrorDesc")} (Status ${error.response.status}: ${
            error.response.data?.message || error.message
          })`
        : `${t("fetchErrorDesc")} (${error.message})`;
      toast.error(errorMessage);
      setCategories([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterType, t]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData, currentPage, searchTerm, filterType]);

  const handleAddCategory = async (name) => {
    setIsLoading(true);
    try {
      await createCategory(name);
      toast.success(t("addSuccessDesc"));
      setCurrentPage(1);
      await fetchCategoriesData();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(t("addErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (id, name, isDelete = false) => {
    setIsLoading(true);
    try {
      if (isDelete) {
        await deleteCategory(id);
        toast.success(t("deleteSuccessDesc", { count: 1 }));
      } else {
        await updateCategory(id, name);
        toast.success(t("editSuccessDesc"));
      }
      setCurrentPage(1);
      await fetchCategoriesData();
    } catch (error) {
      console.error(
        `Error ${isDelete ? "deleting" : "updating"} category:`,
        error
      );
      toast.error(t(isDelete ? "deleteErrorDesc" : "editErrorDesc"));
    } finally {
      setIsLoading(false);
    }
  };

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
                <CardTitle className="text-xl">{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm" className="h-8 gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {t("addCategory")}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("addCategory")}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      <Input
                        id="add-category-name"
                        type="text"
                        placeholder={t("namePlaceholder")}
                        className="mb-4"
                      />
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const input =
                            document.getElementById("add-category-name");
                          if (input && input.value.trim()) {
                            handleAddCategory(input.value.trim());
                          }
                        }}
                      >
                        {t("confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="relative flex items-center gap-2">
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
                    className="cursor-pointer absolute right-0 top-full z-10 mt-2 w-56 bg-background border rounded-md shadow-lg hidden"
                  >
                    <div className="p-2">
                      <div className="space-y-1 p-1">
                        {[
                          { label: t("newest"), value: "newest" },
                          { label: t("oldest"), value: "oldest" },
                        ].map((item) => (
                          <button
                            key={item.value}
                            className={`w-full flex items-center px-3 py-1.5 text-sm rounded hover:bg-accent ${
                              filterType === item.value ? "bg-accent" : ""
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
                  </div>

                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={t("search")}
                      className="h-8 w-[180px]"
                      onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
          <CategoriesGrid
            t={t}
            categories={categories}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            handleEditCategory={handleEditCategory}
            handleAddCategory={handleAddCategory}
          />
        </>
      )}
    </div>
  );
}
