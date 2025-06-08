"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function CardsCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );

  return (
    <div className="h-full w-full rounded-2xl">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full  rounded-2xl  "
        // onMouseEnter={plugin.current.stop}
        // onMouseLeave={plugin.current.reset}
      >
        <div className="  h-full w-full  ">
          <CarouselContent className="h-full flex  ">
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index} className="h-full  ">
                <div className="relative rounded-2xl overflow-hidden h-full w-full">
                  <Image
                    fill
                    src="/event.jpg"
                    alt=""
                    className="object-cover" // you can keep rounded here but not required anymore
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <div className="rounded-2xl z-50 -mt-10 bg-gradient-to-t from-black/90 to-transparent px-2 flex items-center justify-between text-white relative">
          <CarouselPrevious className="z-50 mt-2 static " variant="secondary" />
          <div className="flex-1 text-center">z-50</div>
          <CarouselNext className="z-50 mt-2 static" variant="secondary" />
        </div>
      </Carousel>
    </div>
  );
}
