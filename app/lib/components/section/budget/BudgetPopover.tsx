import { Pencil, Trash2 } from "lucide-react";
import { PopoverContent } from "~/components/ui/popover";
import { Link } from "react-router";

interface Props {
  id: number;
}

export function BudgetPopoverContent({ id }: Props) {
  return (
    <PopoverContent className="w-40 p-2 flex flex-col gap-1">
      <Link
        to={`/auth/budget/${id}`}
        className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors w-full text-left"
      >
        <Pencil className="size-4" />
        Edit
      </Link>
      <button className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-red-50 text-red-500 transition-colors w-full text-left">
        <Trash2 className="size-4" />
        Delete
      </button>
    </PopoverContent>
  );
}
