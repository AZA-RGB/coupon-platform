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
import { Card, CardContent } from "./ui/card";
import useSWR from "swr";
import { LucideClock, LucideClockFading, Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import api from "@/lib/api";
import axios from "axios";

const formSchema = z.object({
  type_name: z.string().min(1),
  criteria_list: z
    .array(z.string())
    .nonempty("Please select at least one item")
    .optional(),
});

export default function AddType() {
  const { data, isLoading, error, mutate } = useSWR(
    "/criterias/index?page=1&isGeneral=false",
    {
      onError: (err) => {
        toast.error("Failed to load criteria list");
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
        .filter((criterion) => values.criteria_list?.includes(criterion.name))
        .map((criterion) => criterion.id);

      const payload = {
        name: values.type_name,
        criteriaIds,
      };

      const response = await api.post("/coupon-types/create", payload);

      toast.success("Coupon type created successfully!");
      console.log("Response:", response.data);
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code outside 2xx
          toast.error(
            `Error: ${error.response.data.message || "Failed to create coupon type"}`,
          );
        } else if (error.request) {
          // Request was made but no response received
          toast.error("Network error - please check your connection");
        } else {
          // Something happened in setting up the request
          toast.error("Request error - please try again");
        }
      } else {
        // Non-axios error
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <Card className="">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl"
          >
            <FormField
              control={form.control}
              name="type_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="eg, collaborative" {...field} />
                  </FormControl>
                  <FormDescription>The name of the type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="criteria_list"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criteria</FormLabel>
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
                        <span>Failed to load criteria</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => mutate()}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                        className="max-w-xs"
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput
                            placeholder={
                              isLoading
                                ? "Loading criteria..."
                                : "Select criteria..."
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
                  <FormDescription>
                    Select criteria to assign it to this type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
