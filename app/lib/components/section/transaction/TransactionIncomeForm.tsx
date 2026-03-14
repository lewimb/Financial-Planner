import { FieldGroup, Field, FieldSet, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import SharedSelect from "../../shared/Select";
import { DatePicker } from "../../shared/DatePicker";
import { categoryOptions } from "~/lib/utils/objectFormatter";
import { useForm } from "@tanstack/react-form";
import { Button } from "~/components/ui/button";
import { useCreateTransaction } from "~/hooks/transactions/use-transaction";
import { useAppStore } from "~/hooks";
import type { TransactionForm } from "~/lib/types/transaction";

import { formSchema } from "~/lib/types/transaction";
import { Spinner } from "~/components/ui/spinner";

export default function TransactionIncomeForm() {
  const store = useAppStore();
  const createTransaction = useCreateTransaction({
    token: store.getState().auth.token,
  });

  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
      date: new Date(),
      category: "",
      account: "",
      type: "income",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const transactionData: TransactionForm = {
        amount: Number(value.amount),
        description: value.description,
        account: value.account,
        userId: store.getState().auth.authUser?.userId,
        date: new Date(value.date),
        type: value.type,
        category: value.category,
      };
      createTransaction.mutateAsync(transactionData);
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
        id="income-form"
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
                      placeholder="Income Amount"
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
        <Button type="submit" form="income-form">
          {createTransaction.isPending ? <Spinner /> : "Submit"}
        </Button>
      </Field>
    </>
  );
}
