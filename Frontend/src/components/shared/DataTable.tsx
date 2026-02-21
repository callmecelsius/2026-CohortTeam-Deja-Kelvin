/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable({
  columns,
  data,
  title,
  emptyMessage = "No data found",
  getRowId,
}: {
  columns: { header: string; accessor?: string; cell?: (row: any) => ReactNode }[];
  data: any[];
  title?: string;
  emptyMessage?: string;
  getRowId?: (row: any, index: number) => string | number;
}) {
  return (
    <div className="w-full space-y-6">
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      )}

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900">
              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  className="font-semibold text-gray-700 dark:text-gray-300"
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-lg font-medium">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={getRowId ? getRowId(row, rowIndex) : rowIndex}
                  className={`
                    transition-colors duration-150
                    ${rowIndex % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50/50 dark:bg-gray-900/50"
                    }
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  `}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessor != null
                          ? String(row[col.accessor] ?? "")
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
