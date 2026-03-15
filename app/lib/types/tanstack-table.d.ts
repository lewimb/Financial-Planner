import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    deleteMethod: (id: string) => void;
    updateMethod?: (value: TData) => void;
  }
}
