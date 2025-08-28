"use client"
import RequestDetailsModal from "@/components/dashboard/requestDialog";
import RequestReviewDialog from "@/components/RequestReviewDialog";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import Link from "next/link";
import useSWR from "swr";

interface RequestsCardProps {
  requestsData: any[];
}

 const RequestsCard = () => {
  const { data, error, isLoading ,mutate} = useSWR("/registration-requests/pending");

  const t = useTranslations();
  return (
    <Card className=" h-full p-4 flex flex-col gap-2">
      <CardTitle className="flex justify-between items-center">
        <span className="text-lg  ">{t("Providers.requests")}</span>
        <Link href="/requests" className="text-sm hover:text-foreground/80">
          {t("Providers.view_all")}
        </Link>
      </CardTitle>
      {isLoading && <Spinner className="animate-spin" />}
      {error && "error loading registration requests"}

      {data?.data && (
        <div className="overflow-auto max-h-[35vh] rounded-xl">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="py-2 px-4 text-start text-muted-foreground">
                  {t("Providers.name")}
                </TableHead>
                <TableHead className="py-2 px-4 text-center text-muted-foreground">
                  {t("Providers.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.data.map((row, index) => (
                <TableRow key={index} className="hover:bg-secondary">
                  <TableCell className="py-2 px-4">{row.user.name}</TableCell>
                  <TableCell className="py-2 px-4">
                    <div className="flex gap-2 justify-center">
                      <RequestDetailsModal request={row} updateRequests={mutate}  key={row.id}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>,
      )}
    </Card>
  );
};


export default RequestsCard
