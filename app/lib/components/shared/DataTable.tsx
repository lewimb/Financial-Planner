"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useSearchParams } from "react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  deleteMethod: (id: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  totalCount,
  deleteMethod,
}: DataTableProps<TData, TValue>) {
  const [, setSearchParams] = useSearchParams();

  // data is already exactly one server-fetched page — no client-side
  // re-pagination needed, just render it.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      deleteMethod,
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPreviousPage = pageIndex > 0;
  const canNextPage = (pageIndex + 1) * pageSize < totalCount;

  const goToPage = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), totalPages - 1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("pagination", String(clamped));
      return next;
    });
  };

  // Windowed page numbers around the current page, plus first/last with
  // ellipses — same pattern as the shadcn Pagination docs/examples.
  const currentPage = pageIndex + 1;
  const pageNumbers = (() => {
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    const pages: (number | "ellipsis")[] = [];
    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) pages.push("ellipsis");
    }
    pages.push(...range);
    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  })();

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="p-3 pt-6 text-muted-foreground"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="group"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="p-3 text-sm" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="py-4 p-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canPreviousPage) goToPage(pageIndex - 1);
                }}
                className={
                  !canPreviousPage ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            {pageNumbers.map((p, i) =>
              p === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(p - 1);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canNextPage) goToPage(pageIndex + 1);
                }}
                className={
                  !canNextPage ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
