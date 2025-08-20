import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTranslations } from "next-intl";
import { DownloadCloud } from "lucide-react";
import { approveRequest, rejectRequest } from "@/app/providers/constants";
import { RequestDetailsModal } from "@/app/requests/page";

interface RequestReviewFormProps {
  providerData: any;
  onActionComplete?: () => void;
  updateRequests: () => void;
}

export function RequestReviewForm({
  className,
  providerData,
  onActionComplete,
  updateRequests,
  ...props
}: RequestReviewFormProps) {
  const t = useTranslations("RequestReviewForm");

  const handleApprove = () => {
    approveRequest(providerData.id);
    onActionComplete?.();
    updateRequests();
  };

  const handleReject = () => {
    rejectRequest(providerData.id);
    onActionComplete?.();
    updateRequests();
  };

  return (
    <div className={cn("  flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className=" p-0 ">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col  items-center h-20 text-center">
                <div className="h-full">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <h1 className="text-2xl font-bold ">
                  {providerData.user.name}
                </h1>
              </div>
              <div className="grid gap-3 mt-10">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={providerData.user.email}
                  disabled
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">{t("phoneLabel")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={providerData.user.phone}
                  disabled
                />
              </div>
              <div className="flex place-content-start  gap-8">
                <Button className="" onClick={handleApprove}>
                  {t("acceptButton")}
                </Button>
                <Button
                  onClick={handleReject}
                  className="hover:bg-chart-5 bg-destructive"
                >
                  {t("denyButton")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
