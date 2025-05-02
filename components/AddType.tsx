import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTranslations } from "next-intl";
import FileUploadDropzone from "./file-uplaod-zone";
import MultipleSelector from "./ui/multiple-selector";

export function AddType({ className, ...props }: React.ComponentProps<"div">) {
  const t = useTranslations("RequestReviewForm");
  const OPTIONS = [
    { label: "nextjs", value: "Nextjs" },
    { label: "Vite", value: "vite",   },
    { label: "Nuxt", value: "nuxt",   },
    { label: "Vue", value: "vue,  ",   },
    { label: "Remix", value: "remix" },
    { label: "Svelte", value: "svelte",   },
    { label: "Angular", value: "angular",   },
    { label: "Ember", value: "ember",   },
    { label: "React", value: "react" },
    { label: "Gatsby", value: "gatsby",   },
    { label: "Astro", value: "astro",   },
  ];
  return (
    <div className={cn("flex ", className)} {...props}>
      <Card className=" ">
        <CardContent className="">
          <form className="">
            <div className="flex flex-col  gap-6">
              <FileUploadDropzone />
              <div className="grid gap-3">
                <Label htmlFor="type">Type</Label>
                <Input id="type" placeholder="eg,collaborative" />
              </div>
              <div className="grid gap-3">
                <MultipleSelector
                    hidePlaceholderWhenSelected
                  defaultOptions={OPTIONS}
                  placeholder="Select frameworks you like..."
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </div>

              <div className="flex place-content-start gap-8">
                <Button type="submit">Add new type</Button>
                <Button
                  type="submit"
                  className="hover:bg-destructive dark:hover:bg-destructive dark:bg-muted  border border-primary"
                >
                  cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
