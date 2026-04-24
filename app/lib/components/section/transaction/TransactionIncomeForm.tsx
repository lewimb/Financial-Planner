import { FieldGroup, Field, FieldSet, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import SharedSelect from "../../shared/Select";
import { DatePicker } from "../../shared/DatePicker";
import { categoryOptions } from "~/lib/utils/objectFormatter";
import { useForm } from "@tanstack/react-form";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useFetcher } from "react-router";
import { useAppStore } from "~/hooks";
import { toast } from "sonner";
import type { Transaction } from "~/lib/types/transaction";
import { formSchema } from "~/lib/types/transaction";
import * as React from "react";

export default function TransactionIncomeForm({
  items,
  isUpdate = false,
  id,
  token,
  onSuccess,
}: {
  items?: Transaction;
  isUpdate?: boolean;
  id?: number;
  token: string;
  onSuccess?: () => void;
}) {
  const store = useAppStore();
  const fetcher = useFetcher();
  const isPending = fetcher.state === "submitting";
  const formId = `income-form-${id ?? "new"}`;

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      // ✅ only after an actual submit
      toast.success(isUpdate ? "Transaction updated" : "Transaction created", {
        position: "top-right",
      });
      onSuccess?.();
    }
    if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(fetcher.data.error, { position: "top-right" });
    }
  }, [fetcher.state, fetcher.data]);

  const form = useForm({
    defaultValues: {
      amount: items?.amount ? String(items.amount) : "",
      description: items?.description ?? "",
      date: items?.date ? new Date(items.date) : new Date(),
      category: items?.category ?? "",
      type: "INCOME",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: Record<string, string | number> = {
        amount: Math.floor(Number(value.amount)),
        description: value.description,
        category: value.category,
        date: new Date(value.date).toISOString(),
        type: value.type,
        userId: store.getState().auth.authUser?.userId ?? 0,
        token,
      };

      if (isUpdate && id) {
        payload.id = id;
      }

      fetcher.submit(payload, {
        method: isUpdate ? "PATCH" : "POST",
        encType: "application/json",
        action: "/auth/transactions",
      });
    },
  });

  return (
    <>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldSet>
          <FieldGroup className="gap-3">
            {/* Amount */}
            <form.Field
              name="amount"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Income Amount"
                      type="number"
                      min={1}
                    />
                  </Field>
                );
              }}
            />

            {/* Description */}
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

            {/* Category */}
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

            {/* Date */}
            <form.Field
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                    <DatePicker
                      onChange={(date) => field.handleChange(date)}
                      handleBlur={field.handleBlur}
                      name={field.name}
                      isInvalid={isInvalid}
                      defaultValue={
                        items?.date ? new Date(items.date) : new Date()
                      }
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
        <Button type="submit" form={formId} disabled={isPending}>
          {isPending ? <Spinner /> : isUpdate ? "Update" : "Submit"}
        </Button>
      </Field>
    </>
  );
}
