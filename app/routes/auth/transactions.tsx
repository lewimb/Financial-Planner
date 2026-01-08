import Header from "~/lib/components/shared/Header";
import TransactionOverview from "../../lib/components/section/transaction/TransactionOverview";
import TransactionTable from "~/lib/components/section/transaction/TransactionTable";
import TransactionForm from "~/lib/components/section/transaction/TransactionForm";
import { Modal } from "~/lib/components/shared/Modal";
export default function Transaction() {
  return (
    <section className="space-y-6">
      <Header
        title="Transactions"
        subtitle="Track and manage your income and expenses"
      >
        <Modal label="+ Add Transaction">
          <TransactionForm />
        </Modal>
      </Header>
      <TransactionOverview />
      <TransactionTable />
    </section>
  );
}
