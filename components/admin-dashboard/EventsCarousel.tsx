"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useLocale } from "next-intl";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { isFloat32Array } from "node:util/types";
const BASE_CDN = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com/";
interface Event {
  id: number;
  title: string;
  description: string;
  from_date: string;
  to_date: string;
  seasonal_event_status: number;
  files: {
    path: string;
    file_type: number;
    name: string;
    title: string | null;
  }[];
  coupons: any[];
}

export function EventsCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );
  const isArabic = useLocale() === "ar";

  const { data, error, isLoading } = useSWR("/seasonal-events/index?page=1");
  const events = "";
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <Carousel
      plugins={[plugin.current]}
      setApi={setApi}
      className="w-full h-full rounded-2xl"
    >
      <div className="h-full w-full">
        <CarouselContent
          className={`h-full flex ${isArabic ? "flex-row-reverse" : ""}`}
        >
          {data
            ? data.data.data.map((event) => (
                <CarouselItem key={event.id} className="h-full">
                  <div className="relative rounded-2xl overflow-hidden h-full w-full">
                    <Image
                      fill
                      src={
                        event.files.length > 0
                          ? `${BASE_CDN}${event.files[0].path}`
                          : "/event.jpg"
                      }
                      alt={event.title}
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))
            : ""}
        </CarouselContent>
      </div>
      <div className="rounded-b-2xl h-10 -mt-10 bg-gradient-to-t from-5% from-gray-900/90  px-2 flex items-center justify-between text-white relative">
        <CarouselPrevious
          className="mt-2 absolute  left-2 top-3"
          variant="ghost"
          style={{ order: isArabic ? 2 : 0 }}
        />
        <div className="flex-1 text-center h-full order-1 mt-5  ">
          {data
            ? data.data.data.length > 0
              ? data.data.data[current].title
              : "event title"
            : ""}
        </div>
        <CarouselNext
          className="mt-2  absolute right-2 top-3"
          variant="ghost"
          style={{ order: isArabic ? 0 : 2 }}
        />
      </div>
    </Carousel>
  );
}
