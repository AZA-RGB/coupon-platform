import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const RequestDetailsModal = ({ request, children }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Providers");

  if (!request) return <>no request</>;

  // Extract data from the nested structure
  const requestData = {
    id: request.id,
    userId: request.user_id,
    name: request.user?.name || "",
    email: request.user?.email || "",
    phone: request.user?.phone || "",
    location: request.user?.provider?.location || "",
    bankId: request.user?.provider?.bank_id || "",
    categoryId: request.user?.provider?.category_id || "",
    description: request.user?.provider?.description || "",
    createdAt: request.created_at,
    status: request.status,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            {t("viewDetails")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden p-0 bg-background border-border">
        <div className="relative">
          <div className="bg-primary/10 py-4 px-6 border-b border-border">
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t("requestDetails")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {requestData.name} • {t("requestId")}:{" "}
                <span className="font-mono text-primary">{requestData.id}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-140px)] px-6 py-5">
            <div className="grid gap-5">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {requestData.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {requestData.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(requestData.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {t("userId")}: {requestData.userId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {t("contactInfo")}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("phone")}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {requestData.phone || t("notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("location")}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {requestData.location || t("notProvided")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    {t("requestInfo")}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("bankId")}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {requestData.bankId || t("notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("categoryId")}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {requestData.categoryId || t("notProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("status")}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {requestData.status === 0
                          ? t("pending")
                          : t("approved")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/40 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  {t("description")}
                </h3>
                <div className="bg-background p-3 rounded border border-border">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {requestData.description || t("noDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-6 py-4 bg-muted/20 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default RequestDetailsModal;
