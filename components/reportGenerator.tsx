import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import Link from "next/link";
import { useState } from "react";

function formatDate(date) {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const ReportGenerator = ({ object, object_type, variant }) => {
  const [dateRange, setDateRange] = useState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant || "outline"}
          className="data-[empty=true]:text-muted-foreground justify-start text-primary text-left font-normal h-8  "
        >
          {" "}
          <CalendarIcon />
          <span>انشاء تقرير</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col content-start items-end">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range) =>
            range && setDateRange({ from: range.from, to: range.to })
          }
          numberOfMonths={2}
        />
        <Button className=" mx-3 mb-2  text-primary" variant="outline">
          <Link
            href={{
              pathname: "/report-page",
              query: {
                object_type: object_type,
                object_id: object.id,
                object_name: object.name || object.title,
                date_filter_start: formatDate(dateRange?.from),
                date_filter_end: formatDate(dateRange?.to),
                image: object.image,
              },
            }}
          >
            Go to Report
          </Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default ReportGenerator;
