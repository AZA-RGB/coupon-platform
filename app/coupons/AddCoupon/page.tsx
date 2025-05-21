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
import MultipleSelector from "@/components/ui/multiple-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import FileUploadDropzone from "@/components/file-uplaod-zone";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  coupon_title: z.string().min(1).max(50),
  coupon_description: z.string().min(30).max(200),
  coupon_expiration_date: z.coerce.date(),
  name_7184091515: z.coerce.number().min(1),
  name_0863847771: z.coerce.number().min(0),
  partner_providers: z.array(z.string()),
  images: z.array(z.instanceof(File)).min(1),
});

export default function AddCoupon() {
  const t = useTranslations("addCoupon");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coupon_expiration_date: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(t("validation.formError"));
    }
  }

  return (
    <div className="flex flex-col items-center max-h-svh  justify-center   px-15">
      <div className="w-full ">
        <div>
          <div className=" p-0">
            <div className="p-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5 p-5 w-full mx-auto grid  grid-col-1 lg:grid-cols-2 gap-x-50 gap-y-1"
                >
                  <div className="col-span-1 space-y-10">

                  

                  <FormField
                    control={form.control}
                    name="coupon_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("title")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("titlePlaceholder")}
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coupon_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("description")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>{t("addDescription")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coupon_expiration_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("expirationDate")}</FormLabel>
                        <DatetimePicker
                          {...field}
                          format={[
                            ["months", "days", "years"],
                            ["hours", "minutes", "am/pm"],
                          ]}
                        />
                        <FormDescription>
                          {t("expirationDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name_7184091515"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("customersRequired")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("customersPlaceholder")}
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("customersDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name_0863847771"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("providersRequired")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("providersPlaceholder")}
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("providersDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partner_providers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("selectProviders")}</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            className="max-h-60 overflow-y-hidden"
                            hidePlaceholderWhenSelected
                            emptyIndicator={
                              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                {t("noResults")}
                              </p>
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                  <div className="">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("coverImages")}</FormLabel>
                          <FormControl>
                            <div className="h-full">

                            <FileUploadDropzone field={field}  />
                            </div>

                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className=" mt-10 flex flex-1 place-content-around">
                      <Button type="submit">{t("submit")}</Button>
                      <Link href="/dashboard">
                        <Button variant="outline">{t("cancel")}</Button>
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
