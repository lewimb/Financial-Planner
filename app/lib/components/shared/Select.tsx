import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface Item {
  value: string;
  label: string;
}

interface SelectProps {
  placeholder: string;
  items: Item[];
  className?: string;
}

export default function SharedSelect({
  placeholder,
  items,
  className,
}: SelectProps) {
  return (
    <Select>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
