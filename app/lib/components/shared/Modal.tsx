import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import * as React from "react";

interface DialogProps {
  label: string;
  className?: string;
  children?: React.ReactNode | ((close: () => void) => React.ReactNode);
}

export function Modal({ label, children, className }: DialogProps) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn(className)}>
          {open &&
            (typeof children === "function" ? children(close) : children)}
        </DialogContent>
      </Dialog>
    </>
  );
}
