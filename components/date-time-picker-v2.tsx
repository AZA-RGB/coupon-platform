"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { FormDescription, FormLabel } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useTranslations } from "next-intl";

interface DateTimePickerV2Props {
  label: string;
  description: string;
  field: ControllerRenderProps<FieldValues, string> & {
    value?: Date | null | undefined;
  };
}

export function DateTimePickerV2({
  label,
  description,
  field,
}: DateTimePickerV2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>("00:00"); // Default time
  const t = useTranslations();
  // Synchronize internal time state with field.value
  useEffect(() => {
    if (field.value instanceof Date && !isNaN(field.value.getTime())) {
      setTime(format(field.value, "HH:mm"));
    } else {
      setTime("00:00"); // Reset to default time if field.value is invalid or null
    }
  }, [field.value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    // If selectedDate is null/undefined, clear the field
    if (!selectedDate) {
      field.onChange(null);
      return;
    }

    const [hours, minutes] = time.split(":");
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(parseInt(hours), parseInt(minutes));

    field.onChange(newDateTime);
    setIsOpen(false); // Close calendar after date selection
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    // If there's already a date in field.value, update its time
    if (field.value instanceof Date && !isNaN(field.value.getTime())) {
      const [hours, minutes] = newTime.split(":");
      const newDateTime = new Date(field.value);
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      field.onChange(newDateTime);
    } else {
      // If no date is selected, use today's date with the selected time
      const today = new Date();
      const [hours, minutes] = newTime.split(":");
      today.setHours(parseInt(hours), parseInt(minutes));
      field.onChange(today);
    }
  };

  // Ensure field.value is a valid Date object before formatting or using its time
  const isFieldDateValid =
    field.value instanceof Date && !isNaN(field.value.getTime());
  const displayValue = isFieldDateValid
    ? `${format(field.value, "PPP")}, ${time}`
    : t("pickDate");

  return (
    <div className="flex w-full gap-4">
      <div className="flex flex-col w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full font-normal",
                !isFieldDateValid && "text-muted-foreground", // Use the valid date check
              )}
            >
              {displayValue}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="label"
              selected={isFieldDateValid ? field.value : undefined}
              onSelect={handleDateSelect}
              fromMonth={new Date()}
              defaultMonth={isFieldDateValid ? field.value : new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col">
        <Select value={time} onValueChange={handleTimeChange}>
          <SelectTrigger className="font-normal focus:ring-0 w-[120px] focus:ring-offset-0">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[15rem]">
              {Array.from({ length: 96 }).map((_, i) => {
                const hour = Math.floor(i / 4)
                  .toString()
                  .padStart(2, "0");
                const minute = ((i % 4) * 15).toString().padStart(2, "0");
                const timeOption = `${hour}:${minute}`;
                return (
                  <SelectItem key={i} value={timeOption}>
                    {timeOption}
                  </SelectItem>
                );
              })}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
