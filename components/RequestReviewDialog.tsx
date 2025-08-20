"use client";

import { RequestReviewForm } from "@/components/RequestReviewForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface RequestReviewDialogProps {
  providerData: any;
  updateRequests: any;
}

export default function RequestReviewDialog({
  providerData,
  updateRequests,
}: RequestReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Providers");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link">{t("viewDetails")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Request Review</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <RequestReviewForm
            providerData={providerData}
            onActionComplete={() => setIsOpen(false)}
            updateRequests={updateRequests}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
