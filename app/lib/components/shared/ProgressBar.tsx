export default function ProgressBar({
  start,
  limit,
}: {
  start: number;
  limit: number;
}) {
  const percent = Math.min((start / limit) * 100, 100);
  return (
    <div
      className="h-2 w-full rounded-lg"
      style={{
        background: `linear-gradient(
        to right,
        #000000 ${percent}%,
        #D3D3D3 ${percent}%
      )`,
      }}
    />
  );
}
