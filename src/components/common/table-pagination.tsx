"use client";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TablePaginationProps = {
  page: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  canPrevious: boolean;
  canNext: boolean;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
};

export function TablePagination({
  page,
  totalPages,
  startItem,
  endItem,
  totalItems,
  canPrevious,
  canNext,
  onPageChange,
  onPrevious,
  onNext,
  className,
}: TablePaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p>
        Showing {startItem} to {endItem} of {totalItems} results
      </p>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="rounded-lg"
          disabled={!canPrevious}
          onClick={onPrevious}
        >
          <AppIcon name="caret-left" className="size-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            type="button"
            variant={pageNumber === page ? "default" : "outline"}
            size="icon-sm"
            className="rounded-lg"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="rounded-lg"
          disabled={!canNext}
          onClick={onNext}
        >
          <AppIcon name="caret-right" className="size-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
