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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DateTimePickerV2 } from "@/components/date-time-picker-v2";
import api from "@/lib/api";
import { useState, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(30).max(200),
  from_date: z.coerce.date(),
  to_date: z.coerce.date(),
  coupon_per_provider: z.coerce.number().min(1),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
});

export default function AddEvent({ refreshEvents }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("addEvent");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      coupon_per_provider: 1,
      image: new File([], ""), // Empty file as initial value
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      form.setValue("image", files[0], { shouldValidate: true });
    }
  };

  const removeFile = () => {
    form.setValue("image", new File([], ""), { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("from_date", values.from_date.toISOString());
      formData.append("to_date", values.to_date.toISOString());
      formData.append(
        "coupon_per_provider",
        values.coupon_per_provider.toString(),
      );

      // Append the single image file
      if (values.image && values.image.size > 0) {
        formData.append("file", values.image);
      }

      const response = await api.post("/seasonal-events/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      refreshEvents();
      console.log("API Response:", response.data);
      toast.success(response.data.message || t("submissionSuccess"));
      setIsOpen(false);
      form.reset();
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || t("validation.formError"));
    } finally {
      setIsLoading(false);
    }
  }

  const selectedImage = form.watch("image");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("newEvent")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-svh overflow-auto">
        <title>Add Event</title>
        <div>
          <div className="text-bold text-3xl text-primary mb-3">
            {t("AddEvent")}
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-10 w-full"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("eventCoverImage")}</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                        {selectedImage && selectedImage.size > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Selected image:
                            </p>
                            <div className="flex items-center justify-between p-2 border rounded-md">
                              <span className="text-sm truncate">
                                {selectedImage.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeFile}
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                      description="Start Date"
                      label="start date"
                      field={field}
                      disabled={isLoading}
                    />
                    <FormDescription />
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
                      disabled={isLoading}
                    />
                    <FormDescription />
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
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                        disabled={isLoading}
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
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
