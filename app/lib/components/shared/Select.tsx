import type React from "react";
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
  id?: string;
  name?: string;
  items: Item[];
  className?: string;
  isInvalid?: boolean;
  value?: string;
  handleBlur?: React.FocusEventHandler<HTMLButtonElement>;
  handleChange?: (value: string) => void;
}

export default function SharedSelect({
  placeholder,
  items,
  id,
  name,
  handleBlur,
  value,
  isInvalid = false,
  handleChange,
  className,
}: SelectProps) {
  return (
    <Select name={name} value={value} onValueChange={handleChange}>
      <SelectTrigger
        onBlur={handleBlur}
        id={id}
        aria-invalid={isInvalid}
        className={cn("w-full", className)}
      >
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
