
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import FileUploadDropzone from "./file-uplaod-zone";
import MultipleSelector from "./ui/multiple-selector";

export function AddType({ className, ...props }: React.ComponentProps<"div">) {
  const t = useTranslations("AddTypeForm");
  const OPTIONS = [
    { label: "nextjs", value: "Nextjs" },
    { label: "Vite", value: "vite" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue" },
    { label: "Remix", value: "remix" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular" },
    { label: "Ember", value: "ember" },
    { label: "React", value: "react" },
    { label: "Gatsby", value: "gatsby" },
    { label: "Astro", value: "astro" },
  ];
  
  return (
    <div className={cn("flex justify-center ", className)} {...props}>
      <Card className="w-1/2 ">
        <CardContent className="">
          <form className="">
            <div className="flex flex-col gap-6">

              {/* <FileUploadDropzone /> */}

              <div className="grid gap-3">
                <Label htmlFor="type">{t("type")}</Label>
                <Input id="type" placeholder={t("typePlaceholder")} />
              </div>
              <div className="grid gap-3">
                <MultipleSelector
                  className="max-h-60 overflow-y-hidden"
                  hidePlaceholderWhenSelected
                  defaultOptions={OPTIONS}
                  placeholder={t("assignCriteria")}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      {t("noResults")}
                    </p>
                  }
                />
              </div>

              <div className="flex flex-col  md:flex-row place-content-around  gap-8">
                <Button type="submit">{t("addNewType")}</Button>
                <Button variant="outline" type="submit">
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}