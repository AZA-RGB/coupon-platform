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

export default function RequestReviewDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Providers");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link">{t("seeDetails")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Request Review</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <RequestReviewForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
