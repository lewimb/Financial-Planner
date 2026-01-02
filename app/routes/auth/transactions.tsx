import { Button } from "~/components/ui/button";
import Header from "~/lib/components/shared/Header";
import TransactionOverview from "../../lib/components/section/transaction/TransactionOverview";
import TransactionTable from "~/lib/components/section/transaction/TransactionTable";
export default function Transaction() {
  return (
    <section className="space-y-6">
      <Header
        title="Transactions"
        subtitle="Track and manage your income and expenses"
      >
        <Button>+ Add transaction</Button>
      </Header>
      <TransactionOverview />
      <TransactionTable />
    </section>
  );
}
