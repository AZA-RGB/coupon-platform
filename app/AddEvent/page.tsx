"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { DatetimePicker } from "@/components/ui/dateTime-picker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import FileUploadDropzone from "@/components/file-uplaod-zone";
import { useTranslations } from "next-intl";
import { DateTimePickerV2 } from "@/components/date-time-picker-v2";
import api from "@/lib/api";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Plus, SplinePointer } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(30).max(200),
  from_date: z.coerce.date(),
  to_date: z.coerce.date(),
  coupon_per_provider: z.coerce.number().min(1),
  images: z.array(z.instanceof(File)).min(1, "min imagwe"),
});

export default function AddEvent({ refreshEvents }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("addEvent");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Consider setting default values for 'from_date' and 'to_date' if desired, e.g.:
      // from_date: new Date(),
      // to_date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); // Set loading to true on submission start
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      // Convert Date objects to ISO strings for consistent API handling
      formData.append("from_date", values.from_date.toISOString());
      formData.append("to_date", values.to_date.toISOString());
      // Convert number to string for FormData
      formData.append(
        "coupon_per_provider",
        values.coupon_per_provider.toString(),
      );

      // Append each image file
      values.images.forEach((file) => {
        formData.append("images", file); // Use "images" as field name for array of files
      });

      // Make the API call
      const response = await api.post("/seasonal-events/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for FormData
        },
      });
      refreshEvents();
      console.log("API Response:", response.data);
      toast.success(response.data.message || t("submissionSuccess"));
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Form submission error", error);
      // Use error message from API response, or a fallback
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("validation.formError"));
      }
    } finally {
      setIsLoading(false); // Set loading to false when submission finishes
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("newEvent")}
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-h-svh overflow-auto">
        <title>Add Event</title>
        <div className="">
          <div className="text-bold text-3xl text-primary mb-3">
            {t("AddEvent")}
          </div>
          <div className="block">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-10  w-full  "
              >
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>{t("eventCoverImages")}</FormLabel> */}
                      <FormControl>
                        <FileUploadDropzone field={field} maxFiles={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("eventTitle")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("eventTitlePlaceholder")}
                          type="text"
                          {...field}
                          disabled={isLoading} // Disable input while loading
                        />
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
                      <FormLabel>{t("eventDescription")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          {...field}
                          disabled={isLoading} // Disable textarea while loading
                        />
                      </FormControl>
                      <FormDescription>{t("addDescription")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="from_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("startDate")}</FormLabel>
                      <DateTimePickerV2
                        description="Expiration Date"
                        label="expiration date"
                        field={field}
                        disabled={isLoading} // Disable date picker while loading
                      />
                      <FormDescription></FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("expirationDate")}</FormLabel>
                      <DateTimePickerV2
                        description="Expiration Date"
                        label="expiration date"
                        field={field}
                        disabled={isLoading} // Disable date picker while loading
                      />
                      <FormDescription></FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coupon_per_provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("maxPerProvider")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("maxPerProviderPlaceholder")}
                          type="number"
                          {...field}
                          onChange={(e) => {
                            // Ensure the value is a number or empty string
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : Number(value));
                          }}
                          disabled={isLoading} // Disable input while loading
                        />
                      </FormControl>
                      <FormDescription>
                        {t("maxPerProviderDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-1 place-content-around">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Spinner className="animate-spin text-foreground" />
                    ) : (
                      t("submit")
                    )}
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="outline" disabled={isLoading}>
                      {t("cancel")}
                    </Button>{" "}
                  </Link>
                </div>
              </form>
            </Form>
          </div>
          {/* </Card> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
