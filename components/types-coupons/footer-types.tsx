import { CardFooter } from "../ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

export function paginateCoupons(
  coupons: typeof couponTypesData,
  page: number,
  perPage: number
) {
  const start = (page - 1) * perPage;
  const end = page * perPage;
  return coupons.slice(start, end);
}


export function CouponPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  t,
  dir,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  t: any;
  dir: "rtl" | "ltr";
}) {
  return (
    <CardFooter className="flex justify-center">
      <Pagination>
        <PaginationContent dir={dir}>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            >
              {t("previous")}
            </PaginationPrevious>
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
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
            >
              {t("next")}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CardFooter>
  );
}