import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

interface DialogProps {
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export function Modal({ label, children, className }: DialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent className={cn(className, "sm:max-w-md", className)}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
