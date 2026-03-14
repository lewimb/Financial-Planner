import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DialogTitle } from "~/components/ui/dialog";
import TransactionExpenseForm from "./TransactionExpenseForm";
import TransactionIncomeForm from "./TransactionIncomeForm";

export default function TransactionFormTab() {
  return (
    <div className="space-y-6">
      <DialogTitle>Add Transaction</DialogTitle>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <TransactionExpenseForm />
        </TabsContent>
        <TabsContent value="income">
          <TransactionIncomeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
