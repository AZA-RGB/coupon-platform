"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(1, { message: "titleRequired" }),
  description: z.string().min(1, { message: "descriptionRequired" }),
  from_date: z.string().min(1, { message: "startDateRequired" }),
  to_date: z.string().min(1, { message: "endDateRequired" }),
  file: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, { message: "invalidFile" }),
});

export default function AddPackageDialog({ refreshPackages }) {
  const t = useTranslations("Packages");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      from_date: "",
      to_date: "",
      file: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("from_date", values.from_date);
      formData.append("to_date", values.to_date);
      if (values.file) {
        formData.append("file", values.file);
      }

      await axios.post("http://164.92.67.78:3002/api/packages/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("addSuccessDesc"), {
        description: t("addSuccess"),
      });
      refreshPackages();
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `${t("addErrorDesc")}: ${error.response.data.message || t("addError")}`,
          );
        } else if (error.request) {
          toast.error(t("networkError"));
        } else {
          toast.error(t("requestError"));
        }
      } else {
        toast.error(t("unexpectedError"));
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          {t("addPackage")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("addPackage")}</DialogTitle>
          <DialogDescription>{t("addPackageDesc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y- personally6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("titlePlaceholder")} {...field} />
                  </FormControl>
                  <div className="h-2"/>

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
                  <div className="h-2"/>

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
                  <div className="h-2"/>

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
                  <div className="h-2"/>

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
                  <div className="h-6"/>
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
                  t("createPackage")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}