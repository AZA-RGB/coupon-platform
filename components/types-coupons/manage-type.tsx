import { Filter, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function CouponManagementHeader({
  t,
  filterType,
  setFilterType,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
}: {
  t: any;
  filterType: string;
  setFilterType: (type: string) => void;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            t={t}
            filterType={filterType}
            setFilterType={setFilterType}
            setCurrentPage={setCurrentPage}
          />
          <SearchInput
            t={t}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </CardHeader>
    </Card>
  );
}

function FilterDropdown({
  t,
  filterType,
  setFilterType,
  setCurrentPage,
}: {
  t: any;
  filterType: string;
  setFilterType: (type: string) => void;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer text-muted-foreground"
        onClick={() =>
          document.getElementById("filter-menu")?.classList.toggle("hidden")
        }
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
              document.getElementById("filter-menu")?.classList.add("hidden");
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SearchInput({
  t,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
}: {
  t: any;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={t("search")}
        className="h-8 max-w-[200px]"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
      <Search className="absolute end-2 top-2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}


// Helper functions
export function filterCoupons(
  coupons: typeof couponTypesData,
  filterType: string,
  searchTerm: string
) {
  return coupons
    .filter((type) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          type.name.toLowerCase().includes(term) ||
          type.description.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .filter((type) => {
      if (["active", "expired", "pending"].includes(filterType)) {
        return type.status === filterType;
      }
      return true;
    })
    .sort((a, b) => {
      if (filterType === "newest")
        return new Date(b.addDate).getTime() - new Date(a.addDate).getTime();
      if (filterType === "oldest")
        return new Date(a.addDate).getTime() - new Date(b.addDate).getTime();
      return 0;
    });
}
