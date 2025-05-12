"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Filter, Plus } from "lucide-react";
import Image from "next/image";

const allCouponsData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  code: `DISCOUNT${i + 1}`,
  name: `Coupon ${i + 1}`,
  type: ["Seasonal", "Flash", "Loyalty", "Welcome"][
    Math.floor(Math.random() * 4)
  ],
  discount: `${Math.floor(Math.random() * 50) + 5}%`,
  uses: Math.floor(Math.random() * 1000),
  status: ["active", "expired", "pending"][Math.floor(Math.random() * 3)],
  image:
    "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
  addDate: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(), // generates a random past date
}));

export default function AllCouponsPage() {
  const [filterType, setFilterType] = useState<string>(""); // "", "newest", "oldest", "active", "expired", "pending"
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 10;
  const totalPages = Math.ceil(allCouponsData.length / couponsPerPage);
  const filteredCoupons = [...allCouponsData].sort((a, b) => {
    if (filterType === "newest") {
      return new Date(b.addDate).getTime() - new Date(a.addDate).getTime();
    } else if (filterType === "oldest") {
      return new Date(a.addDate).getTime() - new Date(b.addDate).getTime();
    } else if (["active", "expired", "pending"].includes(filterType)) {
      return a.status === filterType ? -1 : 1;
    }
    return 0;
  });

  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * couponsPerPage,
    currentPage * couponsPerPage
  );

  return (
    <div className="container mx-0 sm:mx-auto pt-5 pb-6 px-4 space-y-4">
      {/*Section number 1 */}
      <div className=" flex flex-col lg:flex-row gap-4 w-full">
        <Card className="w-full lg:w-3/5 p-4 hidden md:flex flex-col justify-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {["Active Coupons", "Monthly Return", "Total Coupons"].map(
              (title, i) => (
                <div
                  key={i}
                  className="flex-1 p-4 flex flex-col justify-between"
                >
                  <div>
                    <h2>{title}</h2>
                    <h4 className="text-2xl">$24,560</h4>
                  </div>
                  <span className="text-sm text-green-500 mt-2">
                    +8% from last month
                  </span>
                </div>
              )
            )}
          </div>
        </Card>
        <div className=" w-full lg:w-2/5 flex flex-col sm:flex-row sm:grid-cols-2 md:grid-cols-1 gap-4">
          <Link href="/dashboard/top-coupons" className="block">
            <Card className="w-full  hover:shadow-md transition-shadow h-full cursor-pointer p-6">
              <CardTitle className="text-lg text-primary mb-1">
                See Top Coupons
              </CardTitle>
              <CardDescription>
                Navigate to view your top performing coupons
              </CardDescription>
            </Card>
          </Link>

          <Link href="/dashboard/top-sales" className="block">
            <Card className="w-full hover:shadow-md transition-shadow h-full cursor-pointer p-6">
              <CardTitle className="text-lg text-primary mb-1">
                See Top Sales
              </CardTitle>
              <CardDescription>
                Navigate to view your top sales performance
              </CardDescription>
            </Card>
          </Link>
        </div>
        {/* Three vertical cards for sm and below */}
        <div className="flex flex-col gap-4 md:hidden">
          {["Active Coupons", "Monthly Return", "Total Coupons"].map(
            (title, i) => (
              <Card
                key={i}
                className="w-full p-4 flex flex-col justify-between"
              >
                <div>
                  <h2>{title}</h2>
                  <h4 className="text-2xl">$24,560</h4>
                </div>
                <span className="text-sm text-green-500 mt-2">
                  +8% from last month
                </span>
              </Card>
            )
          )}
        </div>
      </div>

      {/*Section number 2*/}
      <Card className="">
        <CardHeader className="flex flex-col sm:flex-row align-center justify-between space-y-0">
          <div>
            <CardTitle>All Coupons</CardTitle>
            <CardDescription>Manage your coupon campaigns</CardDescription>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer text-muted-foreground"
                onClick={() => {
                  const el = document.getElementById("filter-menu");
                  if (el) el.classList.toggle("hidden");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div
                id="filter-menu"
                className="cursor-pointer absolute right-0 z-10 mt-2 w-40 bg-secondary border rounded shadow hidden"
              >
                {[
                  { label: "Newest", value: "newest" },
                  { label: "Oldest", value: "oldest" },
                  { label: "Active", value: "active" },
                  { label: "Expired", value: "expired" },
                  { label: "Pending", value: "pending" },
                ].map((item) => (
                  <button
                    key={item.value}
                    className={` cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-200 hover:text-white-900 dark:hover:bg-gray-100 dark:hover:text-gray-900 ${
                      filterType === item.value ?  "bg-gray-200 text-white-900 dark:bg-gray-100 dark:text-gray-900" : ""
                    }`}
                    onClick={() => {
                      setFilterType(item.value);
                      setCurrentPage(1); // reset to first page
                      const el = document.getElementById("filter-menu");
                      if (el) el.classList.add("hidden");
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/coupons/new">
                <Plus className="mr-2 h-4 w-4" />
                New Coupon
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/*Section number 3*/}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentCoupons.map((coupon) => (
              <Card
                key={coupon.id}
                className="overflow-hidden hover:shadow-md transition-shadow p-0"
              >
                <div className="relative w-full h-32">
                  <Image
                    src={coupon.image}
                    alt={coupon.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-background/90 px-2 py-0.5 rounded text-xs">
                    <span className="text-primary font-bold">
                      {coupon.discount}
                    </span>
                  </div>
                </div>
                <CardHeader className="py-0 px-3">
                  <CardTitle className="text-lg">{coupon.name}</CardTitle>
                  <CardDescription className="flex justify-between items-center text-xs">
                    <span>{coupon.type}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        coupon.status === "active"
                          ? "bg-green-100 text-green-800"
                          : coupon.status === "expired"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-1 px-3">
                  <div className="flex justify-between text-xs">
                    <span>Uses: {coupon.uses}</span>
                    <span>Code: {coupon.code}</span>
                  </div>
                </CardContent>

                <CardFooter className="px-3 pb-3">
                  <Button
                    variant="outline"
                    className="w-full h-8 text-xs"
                    asChild
                  >
                    <Link href={`/dashboard/coupons/${coupon.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>

        {/* Part 4: Pagination */}
        <CardFooter className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
