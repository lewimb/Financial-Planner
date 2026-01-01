import { Button } from "~/components/ui/button";

interface Props {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function Header({ title, subtitle, children }: Props) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="font-md text-neutral-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
