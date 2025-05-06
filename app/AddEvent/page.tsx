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
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import FileUploadDropzone from "@/components/file-uplaod-zone";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  event_title: z.string().min(1).max(50),
  event_description: z.string().min(30).max(200),
  event_expiration_date: z.coerce.date(),
  coupon_per_provider: z.coerce.number().min(1),
  images: z.array(z.instanceof(File)).min(1,'min imagwe'),
});

export default function AddEvent() {
  const t = useTranslations('addEvent');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_expiration_date: new Date(),
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
      toast.error(t('validation.formError'));
    }
  }

  return (
    <div className="flex flex-col items-center max-h-svh overflow-clip justify-center md:p-10 pt-10 p-2">
      <div className="w-full md:max-w-2/3">
        <div>
          <Card className="p-0">
            <CardContent className="grid grid-col-1 lg:grid-cols-2 p-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-10 p-10 w-full max-w-3xl mx-auto my-auto max-h-[calc(100dvh-5rem)] overflow-scroll"
                >
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('eventCoverImages')}</FormLabel>
                        <FormControl>
                          <FileUploadDropzone field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="event_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('eventTitle')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('eventTitlePlaceholder')}
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
                    name="event_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('eventDescription')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t('addDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="event_expiration_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('expirationDate')}</FormLabel>
                        <DatetimePicker
                          {...field}
                          format={[
                            ["months", "days", "years"],
                            ["hours", "minutes", "am/pm"],
                          ]}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coupon_per_provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('maxPerProvider')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('maxPerProviderPlaceholder')} 
                            type="number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {t('maxPerProviderDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-1 place-content-around">
                    <Button type="submit">{t('submit')}</Button>
                    <Link href="/dashboard">
                      <Button variant="outline">{t('cancel')}</Button>
                    </Link>
                  </div>
                </form>
              </Form>

              <div className="bg-primary relative">
                <img
                  src="../addCoupon.jpeg"
                  alt="imageAlt"
                  className="absolute h-full object-cover brightness-[1.1]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}