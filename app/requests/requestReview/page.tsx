import { RequestReviewForm } from "@/components/RequestReviewForm";
import { Card } from "@/components/ui/card";
export default function RequestReview() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RequestReviewForm />
      </div>
    </div>
  );
}
