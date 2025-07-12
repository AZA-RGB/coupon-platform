"use client";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
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
import { Skeleton } from "@/components/ui/skeleton";
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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

const formSchema = z
  .object({
    name: z.string().min(1).max(50),
    description: z.string().min(30).max(200),
    date: z.coerce.date(),
    price: z.coerce.number().min(1),
    images: z.array(z.instanceof(File)).min(1),
    Type: z.string().min(1, "You must select type before adding new coupon"),
  })
  .catchall(z.any())
  .required();

export default function AddCoupon() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      Type: "",
    },
  });
  const t = useTranslations("addCoupon");
  const { data, isLoading, error } = useSWR("/coupon-types/index?page=1");
  const { isMutating: mutatingTypes, trigger: mutateTypes } = useSWRMutation(
    "/coupon-types/index?page=1",
    fetcher,
  );
  const { data: criteriadata, isLoading: LoadingCriteria } = useSWR(
    form.watch("Type")
      ? `/criterias/for-add-Coupon/list/${form.watch("Type")}`
      : null,
  );
  const handleTypeChange = (value: string) => {
    form.setValue("Type", value);
    console.log(value);

    // List of static fields that should not be cleared
    const staticFields = [
      "name",
      "description",
      "date",
      "price",
      "images",
      "Type",
    ];

    // Get all current form values
    const currentValues = form.getValues();

    // Iterate through current values and clear dynamic fields
    for (const key in currentValues) {
      if (
        Object.prototype.hasOwnProperty.call(currentValues, key) &&
        !staticFields.includes(key)
      ) {
        // The formSchema's catchall(z.any()) allows for dynamic keys
        // TypeScript might complain without a cast, but often infers correctly with catchall.
        form.setValue(key, undefined);
      }
    }
  };
  // console.log(criteriadata);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      date,
      Type,
      coupon_type_id,
      name,
      description,
      price,
      images,
      ...rest
    } = values;
    const raw_dynamicCriteria = [
      ...criteriadata.data.by_type,
      ...criteriadata.data.general,
    ];

    // Create the dynamic_criteria_value array
    const dynamic_criteria_value = raw_dynamicCriteria
      .map((criterion) => {
        if (rest.hasOwnProperty(criterion.name)) {
          return { id: criterion.id, value: rest[criterion.name] };
        }
        return null;
      })
      .filter((item) => item !== null); // Remove null values from the array

    const post_values = {
      date,
      coupon_type_id: Number(Type),
      name,
      description,
      price,
      file: images,
      criteriaIds: dynamic_criteria_value,
    };
    console.log("post values :", post_values);

    try {
      const formData = new FormData();
      formData.append("date", date.toISOString()); // Ensure date is in ISO format
      formData.append("coupon_type_id", String(Type));
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price)); // Price should be a string

      // Append each image file to the formData
      images.forEach((image) => {
        formData.append("file", image); // 'file' is the key expected by the API
      });

      dynamic_criteria_value.forEach((item, index) => {
        formData.append(`criteriaIds[${index}][id]`, String(item.id));
        formData.append(`criteriaIds[${index}][value]`, String(item.value));
      });
      console.log(formData.getAll("criteriaIds"));
      const response = await api.post("/coupons/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important: Set the correct content type
        },
      });

      const result = response.data;
      // console.log("Success:", result);
      toast.success(result.message || "Coupon created successfully!");
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.error("Form submission error", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            t("validation.formError"),
        );
      }
    }
  }
  return (
    <div className="flex flex-col self-center   text-lg md:px-20  xl:px-30 2xl:px-50  3xl:px-100">
      <div>
        <Form {...form}>
          {/* Add this right after opening the Form component */}
          {/* {Object.keys(form.formState.errors).length > 0 && (
              <div className="text-red-500 p-4 mb-4">
                <h3>Form Errors:</h3>
                <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
              </div>
            )} */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 p-5 w-full mx-auto  "
          >
            <div className=" grid  grid-col-1 lg:grid-cols-2 gap-x-5 gap-y-5">
              <Card>
                <CardContent className="space-y-10">
                  <FormField
                    control={form.control}
                    name="Type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Type")}</FormLabel>
                        <FormControl>
                          {isLoading || mutatingTypes ? (
                            <Spinner />
                          ) : error ? (
                            <div className="flex items-center gap-2 text-destructive">
                              <span>Failed to load Type</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  mutateTypes();
                                }}
                              >
                                Retry
                              </Button>
                            </div>
                          ) : (
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleTypeChange(value);
                              }}
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
                          className="flex place-content-between items-center "
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
                          <FileUploadDropzone field={field} />
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

                  {/* <FormField
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
                                            /> */}
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
                          Adding...
                        </>
                      ) : (
                        t("addNewCoupon")
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

              {/* <FormField
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
                                        /> */}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
