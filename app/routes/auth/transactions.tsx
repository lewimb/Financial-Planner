import { Button } from "~/components/ui/button";
import Header from "~/lib/components/shared/Header";
import TransactionOverview from "../../lib/components/section/transaction/TransactionOverview";
export default function Transaction() {
  return (
    <section>
      <Header
        title="Transactions"
        subtitle="Track and manage your income and expenses"
      >
        <Button>+ Add transaction</Button>
      </Header>
      <TransactionOverview />
    </section>
  );
}
