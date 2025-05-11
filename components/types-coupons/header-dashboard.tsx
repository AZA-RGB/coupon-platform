"use client";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
// Components
import {
  Card,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";


// Constants
export function DashboardHeader({
  t,
  topCouponsData,
  couponTypeOptions,
  dateRange,
  setDateRange,
  setCouponType,
  handleGenerateReport,
}: {
  t: any;
  topCouponsData: typeof topCouponsData;
  couponTypeOptions: typeof couponTypeOptions;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setCouponType: (type: string) => void;
  handleGenerateReport: () => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <TopCouponsCard t={t} data={topCouponsData} />
      <ReportGeneratorCard
        t={t}
        couponTypeOptions={couponTypeOptions}
        dateRange={dateRange}
        setDateRange={setDateRange}
        setCouponType={setCouponType}
        handleGenerateReport={handleGenerateReport}
      />
    </div>
  );
}

export function TopCouponsCard({ t, data }: { t: any; data: typeof topCouponsData }) {
  return (
    <Card className="w-full lg:w-2/5 p-4 flex gap-4">
      <CardTitle className="text-lg text-primary mb-1">
        {t("topCoupons")}
      </CardTitle>
      <div className="space-y-4">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 px-4 text-start">
                {t("rank")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("couponType")}
              </TableHead>
              <TableHead className="py-2 px-4 text-start">
                {t("sales")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{row.rank}</TableCell>
                <TableCell className="py-2 px-4">{row.couponType}</TableCell>
                <TableCell className="py-2 px-4">{row.sales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function ReportGeneratorCard({
  t,
  couponTypeOptions,
  dateRange,
  setDateRange,
  setCouponType,
  handleGenerateReport,
}: {
  t: any;
  couponTypeOptions: typeof couponTypeOptions;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setCouponType: (type: string) => void;
  handleGenerateReport: () => void;
}) {
  return (
    <Card className="w-full lg:w-3/5 p-4">
      <CardTitle className="text-lg text-primary mb-1">
        {t("generateReport")}
      </CardTitle>
      <div className="space-y-4">
        <CouponTypeSelect
          t={t}
          options={couponTypeOptions}
          onSelect={setCouponType}
        />
        <DateRangePicker
          t={t}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <Button className="w-full mt-2" onClick={handleGenerateReport}>
          {t("generateReport")}
        </Button>
      </div>
    </Card>
  );
}

export function CouponTypeSelect({
  t,
  options,
  onSelect,
}: {
  t: any;
  options: typeof couponTypeOptions;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-4 w-full">
      <Label htmlFor="couponType">{t("couponType")}</Label>
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-full" id="couponType">
          <SelectValue placeholder={t("selectType")} />
        </SelectTrigger>
        <SelectContent>
          {options.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function DateRangePicker({
  t,
  dateRange,
  setDateRange,
}: {
  t: any;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}) {
  return (
    <div className="space-y-4">
      <Label>{t("selectDate")}</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70 shrink-0 " />
              {dateRange?.from ? (
                dateRange?.to ? (
                  <>
                    {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                    {format(dateRange.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                <span className="text-muted-foreground">{t("selectDate")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range: any) => {
                if (range) {
                  setDateRange({
                    from: range.from,
                    to: range.to,
                  });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}