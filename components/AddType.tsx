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
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LucideClock, LucideClockFading, Loader2, Plus } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import api from "@/lib/api";
import axios from "axios";
import useSWR from "swr";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  type_name: z.string().min(1),
  type_description: z.string(),
  criteria_list: z
    .array(z.string())
    .nonempty("الرجاء اختيار عنصر واحد على الأقل")
    .optional(),
});

export default function AddTypeDialog({ refreshTypes }) {
  const { data, isLoading, error, mutate } = useSWR(
    "/criterias/index?page=1&isGeneral=false",
    {
      onError: (err) => {
        toast.error("فشل تحميل قائمة المعايير");
        console.error("Error fetching criteria:", err);
      },
    },
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      criteria_list: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Map selected criteria names to their IDs
      const criteriaIds = data.data.data
        .filter((criterion) => values.criteria_list?.includes(criterion.name)) //get selected criteria (complete object)
        .map((criterion) => criterion.id); // get the id of it only

      const payload = {
        name: values.type_name,
        criteriaIds,
        description: values.type_description,
      };

      const response = await api.post("/coupon-types/create", payload);

      toast.success("تم إنشاء نوع الكوبون بنجاح!");
      console.log("Response:", response.data);
      refreshTypes();
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code outside 2xx
          toast.error(
            `خطأ: ${error.response.data.message || "فشل في إنشاء نوع الكوبون"}`,
          );
        } else if (error.request) {
          // Request was made but no response received
          toast.error("خطأ في الشبكة - يرجى التحقق من اتصالك");
        } else {
          // Something happened in setting up the request
          toast.error("خطأ في الطلب - يرجى المحاولة مرة أخرى");
        }
      } else {
        // Non-axios error
        toast.error("حدث خطأ غير متوقع");
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="" />
          إضافة نوع جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>إنشاء نوع كوبون جديد</DialogTitle>
          <DialogDescription>
            أضف نوع كوبون جديد وقم بتعيين معايير له.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم النوع</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: تعاوني" {...field} />
                  </FormControl>
                  <FormDescription>اسم هذا النوع</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف النوع</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="criteria_list"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المعايير</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center gap-2 text-destructive">
                        <span>فشل تحميل المعايير</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => mutate()}
                        >
                          إعادة المحاولة
                        </Button>
                      </div>
                    ) : (
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput
                            placeholder={
                              isLoading
                                ? "جاري تحميل المعايير..."
                                : "اختر المعايير..."
                            }
                          />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {data?.data?.data?.map((criterion) => (
                              <MultiSelectorItem
                                key={criterion.id}
                                value={criterion.name}
                              >
                                {criterion.name}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    )}
                  </FormControl>
                  <FormDescription>تعيين معايير لهذا النوع</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogTrigger>
              <Button
                type="submit"
                disabled={isLoading || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء نوع"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
