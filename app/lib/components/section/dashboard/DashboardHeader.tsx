import { Button } from "~/components/ui/button";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="font-md text-neutral-400">
          Overview of your financial health
        </p>
      </div>
      <Button>+ Create Budget</Button>
    </div>
  );
}
