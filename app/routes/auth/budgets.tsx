import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import BudgetForm from "~/lib/components/section/budget/BudgetForm";
import BudgetOverview from "~/lib/components/section/budget/BudgetOverview";
import BudgetCategories from "~/lib/components/section/budget/BudgetCategories";
import BudgetBreakdown from "../../lib/components/section/budget/BudgetBreakdown";

export default function Budget() {
  return (
    <section className="space-y-6">
      <Header
        title="Budgets"
        subtitle="Monitor your spending across categories"
      >
        <Modal label="+ Add Budget">
          <BudgetForm />
        </Modal>
      </Header>
      <BudgetOverview />
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <BudgetCategories />
        </div>
        <BudgetBreakdown />
      </div>
    </section>
  );
}
