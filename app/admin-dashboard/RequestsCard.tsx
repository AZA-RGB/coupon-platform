"use client"
import RequestReviewDialog from "@/components/RequestReviewDialog";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import useSWR from "swr";

interface RequestsCardProps {
  requestsData: any[];
}

const RequestsCard = ({ requestsData }: RequestsCardProps) => {
  const { data, error, isLoading } = useSWR("/registration-requests/pending");

  const t = useTranslations();
  return (
    <Card className=" h-full p-4 flex flex-col gap-2">
      <CardTitle className="flex justify-between items-center">
        <span className="text-lg  ">{t("Providers.requests")}</span>
        {/* <Button variant="outline" className="text-sm hover:text-foreground/80">
          {t("Providers.view_all")}
        </Button> */}
      </CardTitle>
      {isLoading && <Spinner className="animate-spin" />}
      {error && "error loading registration requests"}

      {data && (
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
              {data.data.map((row, index) => (
                <TableRow key={index} className="hover:bg-secondary">
                  <TableCell className="py-2 px-4">{row.provider.name}</TableCell>
                  <TableCell className="py-2 px-4">
                    <div className="flex gap-2 justify-center">
                      {console.log(row)}
                      <RequestReviewDialog providerData={row} />
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
