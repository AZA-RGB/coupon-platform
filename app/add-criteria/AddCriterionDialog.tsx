"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "./schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formFieldTypes } from "./FormFeildTypes";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { LoadingButton } from "@/components/ui/loading-buuton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddCriterionDialogProps {
  refresh?: () => void;
}
export function AddCriterionDialog({ refresh }: AddCriterionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "input", // default type
      isGeneral: false,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);

      const response = await api.post("/criterias/create", {
        ...values,
        isGeneral: values.isGeneral ? 1 : 0,
        criteria_type: "coupon_type",
      });
      if (refresh) refresh();
      toast.success(response.data.message);
      setIsOpen(false);

      form.reset();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="-mb-1 p-2">+ New criterion</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Criterion</DialogTitle>
          <DialogDescription>
            Define a new evaluation criterion for your assessment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter criterion name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full max-h-20 overflow-auto">
                        <SelectValue placeholder="Select a field type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-50 overflow-scroll">
                      {formFieldTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isGeneral"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>General criterion</FormLabel>
                    <FormDescription>
                      The criterion will be assigned to all coupon types
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              {loading ? (
                <LoadingButton disabled>Adding...</LoadingButton>
              ) : (
                <Button type="submit" hidden={loading}>
                  Add new criterion
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
