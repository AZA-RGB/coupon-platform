import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { Loader2, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function AddReelDialog({ t, refreshReels }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  const formSchema = z.object({
    description: z.string().min(1, "description is required"),
    file: z
      .any()
      .optional()
      .refine((file) => !file || file instanceof File, {
        message: "invalidFile",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      file: null,
    },
  });

  const handleCancelUpload = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Upload cancelled by user");
      setIsUploading(false);
      setUploadProgress(0);
      toast.info(t("uploadCancelled"));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create new cancel token source for this upload
      cancelTokenSourceRef.current = axios.CancelToken.source();

      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("file", values.file);

      const config: AxiosRequestConfig = {
        headers: { "Content-Type": "multipart/form-data" },
        cancelToken: cancelTokenSourceRef.current.token,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          }
        },
      };

      await api.post("/reels/create", formData, config);

      toast.success(t("addSuccessDesc"), {
        description: t("addSuccess"),
      });
      refreshReels();
      form.reset();
    } catch (error) {
      if (axios.isCancel(error)) {
        // Upload was cancelled - don't show error toast
        return;
      }

      console.error("Form submission error", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `${t("addErrorDesc")}: ${
              error.response.data.message || t("addError")
            }`,
          );
        } else if (error.request) {
          toast.error(t("networkError"));
        } else {
          toast.error(t("requestError"));
        }
      } else {
        toast.error(t("unexpectedError"));
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      cancelTokenSourceRef.current = null;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("newReel")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("addReel")}</DialogTitle>
          <DialogDescription>{t("addReelDesc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("descriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <div className="h-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("file")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      disabled={isUploading}
                    />
                  </FormControl>
                  <div className="h-2" />
                </FormItem>
              )}
            />

            {/* Upload progress section */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("uploading")}...
                    </span>
                    <span className="text-sm font-medium">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelUpload}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t("cancelUpload")}
                  </Button>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => {
                    if (isUploading) {
                      handleCancelUpload();
                    }
                  }}
                >
                  {t("cancel")}
                </Button>
              </DialogTrigger>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isUploading}
              >
                {form.formState.isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? t("uploading") : t("submitting")}
                  </>
                ) : (
                  t("createReel")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
