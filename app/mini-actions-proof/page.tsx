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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { fetchMiniActionProofs,  approveMiniActionProof, rejectMiniActionProof } from "./constants";
import MyImage from "@/components/my-image";

interface MiniAction {
  id: number;
  provider_id: number;
  type: number;
  description: string;
  points: number;
  is_manual: boolean;
  expiryDate: string;
  expected_time: number;
  content: string;
  action_rules: string;
  usage_number: number;
}

interface Customer {
  id: number;
  user_id: number;
  bank_id: string;
  birth_date: string;
  location: string;
  purchases_count: number;
}

interface File {
  id: number;
  path: string;
  file_type: number;
  name: string;
  title: string | null;
}

interface MiniActionProof {
  id: number;
  mini_action_id: number;
  customer_id: number;
  status: "pending" | "success" | "rejected";
  gained_points: number;
  time: number;
  files: File[];
  mini_action: MiniAction;
  customer: Customer;
}

const MiniActionProofDetailsModal = ({
  miniActionProof,
  t,
  open,
  onOpenChange,
}: {
  miniActionProof: MiniActionProof | null;
  t: (key: string, params?: any) => string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!miniActionProof) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{miniActionProof.mini_action.description}</DialogTitle>
          <DialogDescription>{miniActionProof.mini_action.content}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {miniActionProof.files.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">{t("files")}</h4>
              <div className="grid grid-cols-2 gap-2">
                {miniActionProof.files.map((file) => (
                  <div key={file.id} className="relative w-full h-32">
                    <MyImage src={"https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com/"+file.path} alt={file.name} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("customer")}</h4>
              <p className="text-sm text-muted-foreground">{miniActionProof.customer.bank_id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("status")}</h4>
              <p className="text-sm text-muted-foreground capitalize">{t(miniActionProof.status)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("gainedPoints")}</h4>
              <p className="text-sm text-muted-foreground">{miniActionProof.gained_points}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("time")}</h4>
              <p className="text-sm text-muted-foreground">{miniActionProof.time} {t("seconds")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("miniAction")}</h4>
              <p className="text-sm text-muted-foreground">{miniActionProof.mini_action.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("type")}</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {miniActionProof.mini_action.type === 1 ? t("video") : t("action")}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("actionRules")}</h4>
            <p className="text-sm text-muted-foreground">{miniActionProof.mini_action.action_rules}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MiniActionProofsTable = ({
  t,
  miniActionProofs,
  currentPage,
  setCurrentPage,
  totalPages,
  refreshMiniActionProofs,
}: {
  t: (key: string, params?: any) => string;
  miniActionProofs: MiniActionProof[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  refreshMiniActionProofs: () => void;
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedMiniActionProof, setSelectedMiniActionProof] = useState<MiniActionProof | null>(null);

  const columns = useMemo(
    () => [
      { key: "id", label: t("id") || "ID" },
      { key: "mini_action", label: t("miniAction") || "Mini Action" },
      { key: "customer", label: t("customer") || "Customer" },
      { key: "status", label: t("status") || "Status" },
      { key: "gained_points", label: t("gainedPoints") || "Gained Points" },
      { key: "time", label: t("time") || "Time" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t]
  );

  const displayedData = useMemo(
    () => (isRTL ? [...miniActionProofs].reverse() : miniActionProofs),
    [miniActionProofs, isRTL]
  );

  const handleApprove = async (id: number) => {
    try {
      const result = await approveMiniActionProof(id);
      if (result.success) {
        toast.success(t("approveSuccessDesc"), {
          description: t("approveSuccess"),
          duration: 3000,
        });
        refreshMiniActionProofs();
      } else {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Approve error", error);
      if (error.response) {
        toast.error(
          `${t("approveErrorDesc")}: ${error.response.data.message || t("approveError")}`,
          { duration: 7000 }
        );
      } else if (error.request) {
        toast.error(t("networkError"), { duration: 7000 });
      } else {
        toast.error(t("requestError"), { duration: 7000 });
      }
    }
  };

  const handleReject = async (id: number) => {
    try {
      const result = await rejectMiniActionProof(id);
      if (result.success) {
        toast.success(t("rejectSuccessDesc"), {
          description: t("rejectSuccess"),
          duration: 3000,
        });
        refreshMiniActionProofs();
      } else {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Reject error", error);
      if (error.response) {
        toast.error(
          `${t("rejectErrorDesc")}: ${error.response.data.message || t("rejectError")}`,
          { duration: 7000 }
        );
      } else if (error.request) {
        toast.error(t("networkError"), { duration: 7000 });
      } else {
        toast.error(t("requestError"), { duration: 7000 });
      }
    }
  };

  return (
    <>
      <MiniActionProofDetailsModal
        miniActionProof={selectedMiniActionProof}
        t={t}
        open={!!selectedMiniActionProof}
        onOpenChange={(open) => !open && setSelectedMiniActionProof(null)}
      />
      <Card className="shadow-none">
        <CardContent className="p-2">
          <div className="overflow-x-auto">
            <div className="rounded-md border" dir={isRTL ? "rtl" : "ltr"}>
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className={`px-4 py-3 font-medium ${isRTL ? "text-right" : "text-left"}`}
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
                        {t("noMiniActionProofsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((proof) => (
                      <TableRow
                        key={proof.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${proof.id}-${column.key}`}
                            className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {renderTableCellContent(
                              proof,
                              column.key,
                              isRTL,
                              t,
                              setSelectedMiniActionProof,
                              handleApprove,
                              handleReject
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
            <PaginationContent className={`w-full ${isRTL ? "justify-center" : "justify-center"}`}>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
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
  proof: MiniActionProof,
  key: string,
  isRTL: boolean,
  t: (key: string, params?: any) => string,
  setSelectedMiniActionProof: (proof: MiniActionProof | null) => void,
  handleApprove: (id: number) => void,
  handleReject: (id: number) => void
) {
  switch (key) {
    case "id":
      return <span>{proof.id}</span>;
    case "mini_action":
      return (
        <span>
          {proof.mini_action.description.length > 15
            ? proof.mini_action.description.slice(0, 15) + "..."
            : proof.mini_action.description}
        </span>
      );
    case "customer":
      return <span>{proof.customer.bank_id}</span>;
    case "status":
      return <span className="capitalize">{t(proof.status)}</span>;
    case "gained_points":
      return <span>{proof.gained_points}</span>;
    case "time":
      return <span>{proof.time} {t("seconds")}</span>;
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedMiniActionProof(proof)}
          >
            {t("viewDetails")}
          </Button>
          {proof.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(proof.id)}
              >
                {t("approve")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(proof.id)}
              >
                {t("reject")}
              </Button>
            </>
          )}
        </div>
      );
    default:
      return null;
  }
}

export default function MiniActionProofsAllPage() {
  const t = useTranslations("MiniActionProofs");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [miniActionProofs, setMiniActionProofs] = useState<MiniActionProof[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }
  };

  const fetchMiniActionProofsData = async () => {
    setIsLoading(true);
    try {
      const { miniActionProofs, totalPages, currentPage: apiCurrentPage } = await fetchMiniActionProofs(
        currentPage,
        searchQuery,
        filterType
      );
      if (!Array.isArray(miniActionProofs)) {
        throw new Error("Mini-action-proofs data is not an array");
      }
      setMiniActionProofs(miniActionProofs);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error: any) {
      console.error("Error in fetchMiniActionProofsData:", {
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
      setMiniActionProofs([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMiniActionProofsData();
  }, [currentPage, searchQuery, filterType]);

  const currentMiniActionProofs = useMemo(() => {
    return miniActionProofs.sort((a, b) => {
      if (filterType === "newest") {
        return new Date(b.mini_action.expiryDate).getTime() - new Date(a.mini_action.expiryDate).getTime();
      } else if (filterType === "oldest") {
        return new Date(a.mini_action.expiryDate).getTime() - new Date(b.mini_action.expiryDate).getTime();
      } else if (filterType === "pending" || filterType === "success" || filterType === "rejected") {
        return filterType === a.status ? -1 : 1;
      }
      return 0;
    });
  }, [miniActionProofs, filterType]);

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("pending"), value: "pending" },
    { label: t("success"), value: "success" },
    { label: t("rejected"), value: "rejected" },
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
                            filterType === item.value ? "bg-gray-200 dark:bg-gray-600" : ""
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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <Search className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
          </Card>
          <MiniActionProofsTable
            t={t}
            miniActionProofs={currentMiniActionProofs}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            refreshMiniActionProofs={fetchMiniActionProofsData}
          />
        </>
      )}
    </div>
  );
}