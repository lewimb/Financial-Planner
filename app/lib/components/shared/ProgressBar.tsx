import { cn } from "~/lib/utils";
interface ProgresBarProps {
  start: number;
  limit: number;
  startingColor?: string;
  endingColor?: string;
  className?: string;
}

export default function ProgressBar({
  start,
  limit,
  startingColor = "#000000",
  endingColor = "#D3D3D3",
  className,
}: ProgresBarProps) {
  const percent = Math.min((start / limit) * 100, 100);
  return (
    <div
      className={cn("h-2 w-full rounded-lg", className)}
      style={{
        background: `linear-gradient(
        to right,
        ${startingColor} ${percent}%,
        ${endingColor} ${percent}%
      )`,
      }}
    />
  );
}
