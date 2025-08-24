"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const reportTypes = [
  { value: "coupon_type", label: "Coupon Type" },
  { value: "coupon", label: "Coupon" },
  { value: "category", label: "Category" },
  { value: "provider", label: "Provider" },
  { value: "customer", label: "Customer" },
] as const;

// Mock data for different entities - replace with actual data from API
const mockData = {
  coupon_type: [
    { value: "discount", label: "Discount Coupon" },
    { value: "fixed", label: "Fixed Amount" },
  ],
  coupon: [
    { value: "summer2023", label: "Summer Sale 2023" },
    { value: "winter2023", label: "Winter Special" },
  ],
  category: [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
  ],
  provider: [
    { value: "amazon", label: "Amazon" },
    { value: "walmart", label: "Walmart" },
  ],
  customer: [
    { value: "john_doe", label: "John Doe" },
    { value: "jane_smith", label: "Jane Smith" },
  ],
};

const formSchema = z.object({
  reportType: z.enum([
    "coupon_type",
    "coupon",
    "category",
    "provider",
    "customer",
  ]),
  selectedEntity: z.string(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export default function GenerateReportPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle report generation here
  }

  const reportType = form.watch("reportType");

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Report Type Selection */}
              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a report type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entity Selection with Search */}
              {reportType && (
                <FormField
                  control={form.control}
                  name="selectedEntity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Select {reportType.replace("_", " ")}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {field.value
                                ? mockData[reportType].find(
                                    (item) => item.value === field.value,
                                  )?.label
                                : `Search ${reportType.replace("_", " ")}...`}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput
                              placeholder={`Search ${reportType.replace("_", " ")}...`}
                            />
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {mockData[reportType].map((item) => (
                                <CommandItem
                                  key={item.value}
                                  onSelect={() => {
                                    form.setValue("selectedEntity", item.value);
                                  }}
                                >
                                  {item.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Date Range Selection */}
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Range</FormLabel>
                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value.from && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value.from ? (
                              format(field.value.from, "PPP")
                            ) : (
                              <span>From date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value.from}
                            onSelect={(date) =>
                              field.onChange({ ...field.value, from: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value.to && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value.to ? (
                              format(field.value.to, "PPP")
                            ) : (
                              <span>To date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value.to}
                            onSelect={(date) =>
                              field.onChange({ ...field.value, to: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Generate Report
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
