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
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import FileUploadDropzone from "@/components/file-uplaod-zone";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { FormField as FormFieldType } from "@/app/add-criteria/FormFeildTypes";
import { FormFieldRenderer } from "@/app/add-criteria/FormFeildRenderer";
import { DateTimePickerV2 } from "@/components/date-time-picker-v2";
import api from "@/lib/api";
import axios from "axios";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { useSearchParams, useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(1).max(50),
    description: z.string().min(30).max(200),
    date: z.coerce.date(),
    price: z.coerce.number().min(1),
    images: z.array(z.instanceof(File)).optional(), // Made optional for update
    Type: z.string().min(1, "You must select type before updating coupon"),
  })
  .catchall(z.any())
  .required();

export default function UpdateCoupon() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const couponId = searchParams.get("id"); // Get coupon ID from URL

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // date: new Date(),
    },
  });

  const t = useTranslations("addCoupon"); // Reusing translations from add coupon

  // Fetch coupon data
  const { data: couponData, isLoading: isLoadingCoupon } = useSWR(
    couponId ? `/coupons/${couponId}` : null,
    fetcher,
  );

  // Fetch coupon types
  const { data, isLoading, error } = useSWR("/coupon-types/index?page=1");

  // Fetch criteria based on selected type
  const { data: criteriadata, isLoading: LoadingCriteria } = useSWR(
    form.watch("Type")
      ? `/criterias/for-add-Coupon/list/${form.watch("Type")}`
      : null,
  );

  // Set form values when coupon data is loaded
  useEffect(() => {
    if (couponData?.data) {
      const coupon = couponData.data;
      form.reset({
        name: coupon.name,
        description: coupon.description,
        date: new Date(coupon.date),
        price: parseFloat(coupon.price),
        Type: coupon.coupon_type_id.toString(),
      });

      // Set criteria values
      coupon.couponCriteria.forEach((criterion) => {
        form.setValue(criterion.criteria.name, criterion.value);
      });
    }
  }, [couponData, form]);

  const handleTypeChange = (value: string) => {
    form.setValue("Type", value);

    const staticFields = [
      "name",
      "description",
      "date",
      "price",
      "images",
      "Type",
    ];

    const currentValues = form.getValues();
    for (const key in currentValues) {
      if (
        Object.prototype.hasOwnProperty.call(currentValues, key) &&
        !staticFields.includes(key)
      ) {
        form.setValue(key, undefined);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      date,
      Type,
      coupon_type_id,
      name,
      description,
      price,
      amount,
      pointsToBuy,
      images,
      ...rest
    } = values;

    const raw_dynamicCriteria = criteriadata
      ? [...criteriadata.data.by_type, ...criteriadata.data.general]
      : [];

    const dynamic_criteria_value = raw_dynamicCriteria
      .map((criterion) => {
        if (rest.hasOwnProperty(criterion.name)) {
          return { id: criterion.id, value: rest[criterion.name] };
        }
        return null;
      })
      .filter((item) => item !== null);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("pointsToBuy", pointsToBuy);
      formData.append("amount", amount);
      formData.append("date", date.toISOString());
      formData.append("coupon_type_id", String(Type));
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price));

      if (images?.length) {
        images.forEach((image) => {
          formData.append("file", image);
        });
      }

      dynamic_criteria_value.forEach((item, index) => {
        formData.append(`criteriaIds[${index}][id]`, String(item.id));
        formData.append(`criteriaIds[${index}][value]`, String(item.value));
      });
      // console.log(formData);

      const response = await api.post(`/coupons/${couponId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;
      toast.success(result.message || "Coupon updated successfully!");
      router.push("/coupons/provider-coupons");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            t("validation.formError"),
        );
      }
    }
  }

  if (isLoadingCoupon) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col self-center text-lg md:px-20 xl:px-30 2xl:px-50 3xl:px-100">
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 p-5 w-full mx-auto"
          >
            <div className="grid grid-col-1 lg:grid-cols-2 gap-x-5 gap-y-5">
              <Card>
                <CardContent className="space-y-10">
                  <FormField
                    control={form.control}
                    name="Type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Type")}</FormLabel>
                        <FormControl>
                          {isLoading ? (
                            <Spinner />
                          ) : error ? (
                            <div className="flex items-center gap-2 text-destructive">
                              <span>Failed to load Type</span>
                            </div>
                          ) : (
                            <Select
                              onValueChange={handleTypeChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t("TypePlaceholder")}
                                />
                              </SelectTrigger>
                              <SelectContent className="max-h-50 overflow-scroll">
                                {data.data.data.map(
                                  (type: { id: number; name: string }) => (
                                    <SelectItem
                                      key={type.id}
                                      value={type.id.toString()}
                                    >
                                      {type.name}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormDescription>
                          {t("typeDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {LoadingCriteria && <Spinner />}
                  {criteriadata && (
                    <div key={form.watch("Type")} className="space-y-10">
                      {[
                        ...criteriadata.data.by_type,
                        ...criteriadata.data.general,
                      ].map((criterion: FormFieldType) => (
                        <div
                          key={criterion.id}
                          className="flex place-content-between items-center"
                        >
                          <div className="flex-1">
                            <FormFieldRenderer field={criterion} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("coverImages")}</FormLabel>
                        <FormControl>
                          <FileUploadDropzone
                            maxFiles={1}
                            field={field}
                            existingFiles={couponData?.data?.files}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-10">
                  <FormField
                    control={form.control}
                    name="name"
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
                    name="description"
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
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("expirationDate")}</FormLabel>
                        <DateTimePickerV2
                          description="Expiration Date"
                          label="expiration date"
                          field={field}
                        />
                        <FormDescription>
                          {t("expirationDescription")}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pointsToBuy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points to buy</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center place-content-around">
                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        LoadingCriteria ||
                        form.formState.isSubmitting
                      }
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Coupon"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => form.reset()}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
