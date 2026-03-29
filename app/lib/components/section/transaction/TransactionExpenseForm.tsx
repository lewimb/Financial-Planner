import { FieldGroup, Field, FieldSet, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import SharedSelect from "../../shared/Select";
import { DatePicker } from "../../shared/DatePicker";
import { categoryOptions } from "~/lib/utils/objectFormatter";
import { useForm } from "@tanstack/react-form";
import { Button } from "~/components/ui/button";
import { useCreateTransaction } from "~/hooks/transactions/use-transaction";
import { useUpdateTransaction } from "~/hooks/transactions/use-transaction";
import { useAppStore } from "~/hooks";
import { Spinner } from "~/components/ui/spinner";
import type { Transaction } from "~/lib/types/transaction";
import { formSchema } from "~/lib/types/transaction";

export default function TransactionExpenseForm({
  items,
  isUpdate = false,
  id,
}: {
  items?: Transaction;
  isUpdate?: boolean;
  id?: number;
}) {
  const store = useAppStore();
  const token = store.getState().auth.token;
  const createTransaction = useCreateTransaction({
    token,
  });

  const updateTransaction = useUpdateTransaction(token);

  const form = useForm({
    defaultValues: {
      amount: items?.amount ? Number(items?.amount) : "",
      description: items?.description ? items?.description : "",
      date: items?.date ? new Date(items?.date) : new Date(),
      category: items?.category ? items?.category : "",
      account: items?.account ? items?.account : "",
      type: "expense",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const transactionData: Transaction = {
        amount: Number(value.amount),
        description: value.description,
        account: value.account,
        userId: store.getState().auth.authUser?.userId,
        date: new Date(value.date),
        type: value.type,
        category: value.category,
      };
      if (isUpdate) {
        transactionData.id = id;
        updateTransaction.mutateAsync(transactionData);
      } else {
        createTransaction.mutateAsync(transactionData);
      }
    },
  });

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

  return (
    <>
      <form
        id="expense-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldSet>
          <FieldGroup className="gap-3">
            <form.Field
              name="amount"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor="amount">Amount</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Expense Amount"
                      type="number"
                    />
                  </Field>
                );
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Description"
                    />
                  </Field>
                );
              }}
            />

            <form.Field
              name="category"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <SharedSelect
                      id={field.name}
                      handleBlur={field.handleBlur}
                      handleChange={field.handleChange}
                      value={field.state.value}
                      isInvalid={isInvalid}
                      items={categoryOptions}
                      placeholder="Select category"
                    />
                  </Field>
                );
              }}
            />

            <form.Field
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor="date">Date</FieldLabel>
                    <DatePicker
                      onChange={(date) => field.handleChange(date)}
                      handleBlur={field.handleBlur}
                      name={field.name}
                      isInvalid={isInvalid}
                    />
                  </Field>
                );
              }}
            />

            <form.Field
              name="account"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Account</FieldLabel>
                    <SharedSelect
                      id={field.name}
                      handleBlur={field.handleBlur}
                      handleChange={field.handleChange}
                      value={field.state.value}
                      isInvalid={isInvalid}
                      items={account}
                      placeholder="Select account"
                    />
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </FieldSet>
      </form>
      <Field orientation="horizontal" className="w-full pt-4">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="expense-form">
          {createTransaction.isPending ? <Spinner /> : "Submit"}
        </Button>
      </Field>
    </>
  );
}
