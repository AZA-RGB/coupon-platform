"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { toast } from "sonner";

const addFormSchema = z.object({
  title: z.string().min(1, { message: "titleRequired" }),
  description: z.string().min(1, { message: "descriptionRequired" }),
  from_date: z.string().min(1, { message: "startDateRequired" }),
  to_date: z.string().min(1, { message: "endDateRequired" }),
  max_providers: z.string().min(1, { message: "maxProvidersRequired" }),
  max_price: z.string().min(1, { message: "maxPriceRequired" }),
  max_amount: z.string().min(1, { message: "maxAmountRequired" }),
  max_coupons_number: z.string().min(1, { message: "maxCouponsNumberRequired" }),
  file: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "invalidFile",
    }),
});

export default function AddPackageDialog({ refreshPackages }) {
  const t = useTranslations("Packages");
  const form = useForm({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      title: "",
      description: "",
      from_date: "",
      to_date: "",
      max_providers: "",
      max_price: "",
      max_amount: "",
      max_coupons_number: "",
      file: null,
    },
  });

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("from_date", values.from_date);
      formData.append("to_date", values.to_date);
      formData.append("max_providers", values.max_providers);
      formData.append("max_price", values.max_price);
      formData.append("max_amount", values.max_amount);
      formData.append("max_coupons_number", values.max_coupons_number);
      if (values.file) {
        formData.append("file", values.file);
      }

      await axios.post("http://164.92.67.78:3002/api/packages/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("addSuccessDesc"), {
        description: t("addSuccess"),
        duration: 3000,
      });
      refreshPackages();
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `${t("addErrorDesc")}: ${error.response.data.message || t("addError")}`,
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
        
        <Button size="sm">{t("addPackage")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("addPackage")}</DialogTitle>
          <DialogDescription>{t("addPackageDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
              <FormField
                control={form.control}
                name="max_providers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxProviders")}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={t("maxProvidersPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxPrice")}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={t("maxPricePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxAmount")}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={t("maxAmountPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_coupons_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxCouponsNumber")}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={t("maxCouponsNumberPlaceholder")} {...field} />
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
                        accept="image/*"
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("addPackage")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}