"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldType, formSchema, FormValues } from "./schemas";
import { Form, FormDescription, FormField } from "@/components/ui/form";
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
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formFieldTypes } from "./FormFeildTypes";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/components/ui/loading-buuton";
import { PencilLine } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface UpdateCriterionDialogProps {
  refresh?: () => void;
  criterion: {
    name: string;
    type: FormFieldType;
    isGeneral: boolean;
    id: string;
  };
}
export function UpdateCriterionDialog({
  refresh,
  criterion,
}: UpdateCriterionDialogProps) {
  const [isOpen, setIsOpen] = useState(false); // State to control dialog
  const [loading, setLoading] = useState(false);
  const t = useTranslations("UpdateCriterionDialog");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: criterion.name,
      type: criterion.type, // default type
      isGeneral: criterion.isGeneral,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      const response = await api.put(`/criterias/${criterion.id}`, {
        ...values,
        isGeneral: values.isGeneral ? 1 : 0,
      });
      if (refresh) refresh();

      setIsOpen(false);
      toast.success(response.data.message);
      form.reset();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    form.reset({
      name: criterion.name,
      type: criterion.type,
      isGeneral: criterion.isGeneral,
    });
  }, [criterion, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <PencilLine className="text-ring" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("updateCriterion")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
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
                  <FormLabel>{t("typeLabel")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full max-h-20 overflow-auto">
                        <SelectValue placeholder={t("typePlaceholder")} />
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
                    <FormLabel>{t("generalCriterion")}</FormLabel>
                    <FormDescription>
                      {t("generalCriterionDescription")}
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              {loading ? (
                <LoadingButton disabled>{t("updatingButton")}</LoadingButton>
              ) : (
                <Button type="submit" hidden={loading}>
                  {t("updateButton")}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
