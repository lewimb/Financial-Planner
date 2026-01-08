import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field";
import { categoryOptions } from "~/lib/utils/objectFormatter";
import SharedSelect from "../../shared/Select";
import { DatePicker } from "../../shared/DatePicker";

const account = [
  {
    value: "main checking",
    label: "Main Checking",
  },
  {
    value: "credit card",
    label: "Credit Card",
  },
  {
    value: "saving accounts",
    label: "Saving Accounts",
  },
];

export default function TransactionForm() {
  return (
    <div className="space-y-6">
      <DialogTitle>Add Transaction</DialogTitle>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <form>
            <FieldSet>
              <FieldGroup className="gap-3">
                <Field>
                  <FieldLabel htmlFor="amount">Amount</FieldLabel>
                  <Input
                    placeholder="Expense Amount"
                    id="amount"
                    type="number"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    placeholder="e.g., Grocery Shopping"
                    id="description"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <SharedSelect
                    id="category"
                    items={categoryOptions}
                    placeholder="Select category"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <DatePicker />
                </Field>
                <Field>
                  <FieldLabel htmlFor="account">Account</FieldLabel>
                  <SharedSelect
                    id="account"
                    items={account}
                    placeholder="Select account"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </TabsContent>
        <TabsContent value="income">
          <form>
            <FieldSet>
              <FieldGroup className="gap-3">
                <Field>
                  <FieldLabel htmlFor="amount">Amount</FieldLabel>
                  <Input id="amount" type="number" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    placeholder="e.g., Grocery Shopping"
                    id="description"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <SharedSelect
                    id="category"
                    items={categoryOptions}
                    placeholder="Select category"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <DatePicker />
                </Field>
                <Field>
                  <FieldLabel htmlFor="account">Account</FieldLabel>
                  <SharedSelect
                    id="account"
                    items={account}
                    placeholder="Select account"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
