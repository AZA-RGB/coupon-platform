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
import { fetchMiniActions, deleteMiniAction } from "./constants";
import MyImage from "@/components/my-image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface MiniAction {
  id: string;
  type: "video" | "action";
  description: string;
  provider: string;
  points: number;
  isManual: boolean;
  expiryDate: string;
  expectedTime: number;
  content: string;
  actionRules: string;
  usageNumber: number;
  image: string;
}

const editFormSchema = z.object({
  type: z.enum(["1", "2"], { required_error: "typeRequired" }),
  description: z.string().min(1, { message: "descriptionRequired" }),
  points: z.number().min(1, { message: "pointsRequired" }),
  is_manual: z.boolean(),
  expiryDate: z.string().min(1, { message: "expiryDateRequired" }),
  expected_time: z.number().min(0, { message: "expectedTimeRequired" }),
  content: z.string().min(1, { message: "contentRequired" }),
  action_rules: z.string().min(1, { message: "actionRulesRequired" }),
  usage_number: z.number().min(0, { message: "usageNumberRequired" }),
});

type EditFormValues = z.infer<typeof editFormSchema>;

const AddMiniActionDialog = ({
  refreshMiniActions,
  t,
}: {
  refreshMiniActions: () => void;
  t: (key: string, params?: any) => string;
}) => {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      type: "1",
      description: "",
      points: 0,
      is_manual: false,
      expiryDate: "",
      expected_time: 0,
      content: "",
      action_rules: "",
      usage_number: 0,
    },
  });

  async function onSubmit(values: EditFormValues) {
    try {
      const payload = {
        type: values.type,
        description: values.description,
        points: values.points,
        is_manual: values.is_manual,
        expiryDate: values.expiryDate,
        expected_time: values.type === "2" ? 0 : values.expected_time,
        content: values.content,
        action_rules: values.action_rules,
        usage_number: values.usage_number,
      };

      await axios.post("http://164.92.67.78:3002/api/mini-actions/create", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(t("addSuccessDesc"), {
        description: t("addSuccess"),
        duration: 3000,
      });
      refreshMiniActions();
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`${t("addErrorDesc")}: ${error.response.data.message || t("addError")}`, {
            duration: 7000,
          });
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
        <Button size="sm">{t("addMiniAction")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addMiniAction")}</DialogTitle>
          <DialogDescription>{t("addMiniActionDesc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {field.value === "1" ? t("video") : t("action")}
                          <span className="ml-2">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onSelect={() => field.onChange("1")}>
                          {t("video")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => field.onChange("2")}>
                          {t("action")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("descriptionPlaceholder")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("descriptionPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("points")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("pointsPlaceholder")}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_manual"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                  </FormControl>
                  <FormLabel>{t("isManual")}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("expiryDate")}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("type") === "1" && (
              <FormField
                control={form.control}
                name="expected_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("expectedTime")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("expectedTimePlaceholder")}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("content")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("contentPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="action_rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("actionRules")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("actionRulesPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usage_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("usageNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("usageNumberPlaceholder")}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("addMiniAction")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const EditMiniActionDialog = ({
  miniAction,
  refreshMiniActions,
  t,
}: {
  miniAction: MiniAction;
  refreshMiniActions: () => void;
  t: (key: string, params?: any) => string;
}) => {
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      type: miniAction?.type === "video" ? "1" : "2",
      description: miniAction?.description || "",
      points: miniAction?.points || 0,
      is_manual: miniAction?.isManual || false,
      expiryDate: miniAction?.expiryDate
        ? new Date(miniAction.expiryDate).toISOString().slice(0, 16)
        : "",
      expected_time: miniAction?.expectedTime || 0,
      content: miniAction?.content || "",
      action_rules: miniAction?.actionRules || "",
      usage_number: miniAction?.usageNumber || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof editFormSchema>) {
    try {
      const payload = {
        type: values.type,
        description: values.description,
        points: values.points,
        is_manual: values.is_manual,
        expiryDate: values.expiryDate,
        expected_time: values.type === "2" ? 0 : values.expected_time,
        content: values.content,
        action_rules: values.action_rules,
        usage_number: values.usage_number,
      };

      await axios.put(`http://164.92.67.78:3002/api/mini-actions/${miniAction.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(t("editSuccessDesc"), {
        description: t("editSuccess"),
        duration: 3000,
      });
      refreshMiniActions();
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`${t("editErrorDesc")}: ${error.response.data.message || t("editError")}`, {
            duration: 7000,
          });
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
          {t("editMiniAction")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editMiniAction")}</DialogTitle>
          <DialogDescription>{t("editMiniActionDesc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {field.value === "1" ? t("video") : t("action")}
                          <span className="ml-2">▼</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onSelect={() => field.onChange("1")}>
                          {t("video")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => field.onChange("2")}>
                          {t("action")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("descriptionPlaceholder")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("descriptionPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("points")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("pointsPlaceholder")}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_manual"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                  </FormControl>
                  <FormLabel>{t("isManual")}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("expiryDate")}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("type") === "1" && (
              <FormField
                control={form.control}
                name="expected_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("expectedTime")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("expectedTimePlaceholder")}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("content")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("contentPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="action_rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("actionRules")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("actionRulesPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usage_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("usageNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("usageNumberPlaceholder")}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("updateMiniAction")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
const MiniActionDetailsModal = ({
  miniAction,
  t,
  open,
  onOpenChange,
}: {
  miniAction: MiniAction | null;
  t: (key: string, params?: any) => string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!miniAction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative w-full h-64 mt-4">
            <MyImage src={miniAction.image} alt={miniAction.description} />
          </div>
          <DialogTitle>{miniAction.description}</DialogTitle>
          <DialogDescription>{miniAction.content}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("provider")}</h4>
              <p className="text-sm text-muted-foreground">{miniAction.provider}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("type")}</h4>
              <p className="text-sm text-muted-foreground capitalize">{t(miniAction.type)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("points")}</h4>
              <p className="text-sm text-muted-foreground">{miniAction.points}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("isManual")}</h4>
              <p className="text-sm text-muted-foreground">
                {miniAction.isManual ? t("yes") : t("no")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">{t("expiryDate")}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(miniAction.expiryDate).toLocaleDateString()}
              </p>
            </div>
            {miniAction.type === "video" && (
              <div>
                <h4 className="text-sm font-medium">{t("expectedTime")}</h4>
                <p className="text-sm text-muted-foreground">
                  {miniAction.expectedTime} {t("seconds")}
                </p>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("actionRules")}</h4>
            <p className="text-sm text-muted-foreground">{miniAction.actionRules}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">{t("usageNumber")}</h4>
            <p className="text-sm text-muted-foreground">{miniAction.usageNumber}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MiniActionsTable = ({
  t,
  miniActions,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedMiniActions,
  setSelectedMiniActions,
  handleDeleteSelected,
  handleSelectMiniAction,
  refreshMiniActions,
}: {
  t: (key: string, params?: any) => string;
  miniActions: MiniAction[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  selectedMiniActions: string[];
  setSelectedMiniActions: (ids: string[]) => void;
  handleDeleteSelected: () => void;
  handleSelectMiniAction: (id: string) => void;
  refreshMiniActions: () => void;
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [selectedMiniAction, setSelectedMiniAction] = useState<MiniAction | null>(null);

  const columns = useMemo(
    () => [
      { key: "select", label: t("select") || "Select" },
      { key: "image", label: t("image") || "Image" },
      { key: "description", label: t("description") || "Description" },
      { key: "provider", label: t("provider") || "Provider" },
      { key: "type", label: t("type") || "Type" },
      { key: "points", label: t("points") || "Points" },
      { key: "expiryDate", label: t("expiryDate") || "Expiry Date" },
      { key: "actions", label: t("actions") || "Actions" },
    ],
    [t]
  );

  const displayedData = useMemo(
    () => (isRTL ? [...miniActions].reverse() : miniActions),
    [miniActions, isRTL]
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleToggleSelectAll = () => {
    const allSelected = miniActions.every((action) => selectedMiniActions.includes(action.id));
    setSelectedMiniActions(allSelected ? [] : miniActions.map((action) => action.id));
  };

  return (
    <>
      <MiniActionDetailsModal
        miniAction={selectedMiniAction}
        t={t}
        open={!!selectedMiniAction}
        onOpenChange={(open) => !open && setSelectedMiniAction(null)}
      />
      <Card className="shadow-none">
        <CardContent className="p-2">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleToggleSelectAll}
              disabled={miniActions.length === 0}
              className="cursor-pointer"
            >
              {t(
                selectedMiniActions.length === miniActions.length && miniActions.length > 0
                  ? "deselectAll"
                  : "selectAll"
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={selectedMiniActions.length === 0}
                >
                  {t("deleteSelected")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("confirmDeleteDesc", { count: selectedMiniActions.length })}
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
                        {t("noMiniActionsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((action) => (
                      <TableRow
                        key={action.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${action.id}-${column.key}`}
                            className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {renderTableCellContent(
                              action,
                              column.key,
                              isRTL,
                              t,
                              formatDate,
                              handleSelectMiniAction,
                              setSelectedMiniAction,
                              refreshMiniActions,
                              selectedMiniActions
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
  miniAction: MiniAction,
  key: string,
  isRTL: boolean,
  t: (key: string, params?: any) => string,
  formatDate: (date: string) => string,
  handleSelectMiniAction: (id: string) => void,
  setSelectedMiniAction: (action: MiniAction | null) => void,
  refreshMiniActions: () => void,
  selectedMiniActions: string[]
) {
  switch (key) {
    case "select":
      return (
        <Checkbox
          className="mx-6"
          checked={selectedMiniActions.includes(miniAction.id)}
          onCheckedChange={() => handleSelectMiniAction(miniAction.id)}
        />
      );
    case "image":
      return (
        <div className="relative w-9 h-10 cursor-pointer">
          <MyImage src={miniAction.image} alt={miniAction.description} />
        </div>
      );
    case "description":
      return (
        <span className="font-medium">
          {miniAction.description.length > 15
            ? miniAction.description.slice(0, 15) + "..."
            : miniAction.description}
        </span>
      );
    case "provider":
      return <span>{miniAction.provider}</span>;
    case "type":
      return <span className="capitalize">{t(miniAction.type)}</span>;
    case "points":
      return <span>{miniAction.points}</span>;
    case "expiryDate":
      return <span>{formatDate(miniAction.expiryDate)}</span>;
    case "actions":
      return (
        <div className="flex gap-2">
          <Button
            variant="link"
            className="text-primary underline hover:text-primary/80 p-0 h-auto"
            onClick={() => setSelectedMiniAction(miniAction)}
          >
            {t("viewDetails")}
          </Button>
          <EditMiniActionDialog
            miniAction={miniAction}
            refreshMiniActions={refreshMiniActions}
            t={t}
          />
        </div>
      );
    default:
      return null;
  }
}

export default function MiniActionsAllPage() {
  const t = useTranslations("MiniActions");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedMiniActions, setSelectedMiniActions] = useState<string[]>([]);
  const [miniActions, setMiniActions] = useState<MiniAction[]>([]);
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

  const handleSelectMiniAction = (id: string) => {
    setSelectedMiniActions((prev) =>
      prev.includes(id) ? prev.filter((actionId) => actionId !== id) : [...prev, id]
    );
  };

  const fetchMiniActionsData = async () => {
    setIsLoading(true);
    try {
      const { miniActions, totalPages, currentPage: apiCurrentPage } = await fetchMiniActions(
        currentPage,
        searchQuery,
        filterType
      );
      if (!Array.isArray(miniActions)) {
        throw new Error("Mini-actions data is not an array");
      }
      setMiniActions(miniActions);
      setTotalPages(totalPages || 1);
      if (apiCurrentPage !== currentPage) {
        setCurrentPage(apiCurrentPage || 1);
      }
    } catch (error: any) {
      console.error("Error in fetchMiniActionsData:", {
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
      setMiniActions([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMiniActionsData();
  }, [currentPage, searchQuery, filterType]);

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    try {
      const deletePromises = selectedMiniActions.map((id) => deleteMiniAction(id));
      const results = await Promise.all(deletePromises);
      const failedDeletions = results.filter((result) => !result.success);
      if (failedDeletions.length > 0) {
        const errorMessages = failedDeletions.map((result) => {
          const error = result.error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          return `Mini-action ID ${result.id}: ${status ? `Status ${status} - ` : ""}${message}`;
        });
        toast.error(t("deleteFailedDesc"), {
          description: errorMessages.join("; ") || t("deleteFailed"),
          duration: 7000,
        });
      } else {
        toast.success(t("deleteSuccessDesc", { count: selectedMiniActions.length }), {
          description: t("deleteSuccess"),
          duration: 3000,
        });
        setSelectedMiniActions([]);
        setCurrentPage(1);
        await fetchMiniActionsData();
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      toast.error(
        `${t("deleteErrorDesc")} ${status ? `(Status ${status})` : ""}: ${message}`,
        {
          description: t("deleteError"),
          duration: 7000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentMiniActions = useMemo(() => {
    return miniActions.sort((a, b) => {
      if (filterType === "newest") {
        return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
      } else if (filterType === "oldest") {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return 0;
    });
  }, [miniActions, filterType]);

  const filterOptions = [
    { label: t("newest"), value: "newest" },
    { label: t("oldest"), value: "oldest" },
    { label: t("video"), value: "1" },
    { label: t("action"), value: "2" },
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
                <AddMiniActionDialog refreshMiniActions={fetchMiniActionsData} t={t} />
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
          <MiniActionsTable
            t={t}
            miniActions={currentMiniActions}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            selectedMiniActions={selectedMiniActions}
            setSelectedMiniActions={setSelectedMiniActions}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectMiniAction={handleSelectMiniAction}
            refreshMiniActions={fetchMiniActionsData}
          />
        </>
      )}
    </div>
  );
}