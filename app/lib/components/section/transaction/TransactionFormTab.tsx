import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DialogTitle } from "~/components/ui/dialog";
import TransactionExpenseForm from "./TransactionExpenseForm";
import TransactionIncomeForm from "./TransactionIncomeForm";
import type { Transaction } from "~/lib/types/transaction";

interface Props {
  items?: Transaction;
  dialogTitle?: string;
  id?: number;
}

export default function TransactionFormTab({
  items,
  dialogTitle = "Add Transaction",
  id,
}: Props) {
  return (
    <div className="space-y-6">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <TransactionExpenseForm items={items} id={id} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionIncomeForm items={items} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
