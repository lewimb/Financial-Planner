import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import GoalsOverview from "../../lib/components/section/goals/GoalsOverview";
import GoalsList from "~/lib/components/section/goals/GoalsList";
import GoalsMilestone from "../../lib/components/section/goals/GoalsMilestone";
import type { Goal } from "~/lib/types/goals";
import { GoalsFields } from "~/lib/components/section/goals/GoalsForm";
import type { Route } from "./+types/goals";
import { data, redirect } from "react-router";
import type { GoalOverview } from "~/lib/types/goals";
import { getToken } from "~/lib/utils/tokenStore";

interface LoaderData {
  data: Goal[] | null;
  dataOverview: GoalOverview | null;
  milestones: Goal[] | null;
  status: boolean;
}

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [goalsRes, overviewRes] = await Promise.all([
      fetch(`${baseUrl}/auth/v1/goals`, { headers }).then((r) => r.json()),
      fetch(`${baseUrl}/auth/v1/goals/overview`, { headers }).then((r) =>
        r.json(),
      ),
    ]);

    return {
      data: goalsRes.data,
      dataOverview: overviewRes.data,
      milestones: overviewRes.data?.goals ?? [],
      status: true,
    };
  } catch {
    return { status: false, data: null, dataOverview: null, milestones: [] };
  }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const token = getToken();
  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fd = await request.formData();
  const intent = fd.get("intent");

  if (intent === "post") {
    const name = fd.get("name") as string;
    const description = fd.get("description") as string;
    const target_amount = fd.get("target_amount") as string;
    const target_date = fd.get("target_date") as string;

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Please input the name of the goal";
    if (!description) errors.description = "Please input the description";
    if (!target_amount) errors.target_amount = "Please input the target amount";
    else if (isNaN(Number(target_amount)))
      errors.target_amount = "Must be a number";
    if (!target_date) errors.target_date = "Please input the target date";

    if (Object.keys(errors).length > 0)
      return data({ errors }, { status: 400 });

    try {
      const response = await fetch(`${baseUrl}/auth/v1/goals`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          description,
          target_amount: Number(target_amount),
          deadline: new Date(target_date),
        }),
      }).then((r) => r.json());
      return data({ data: response }, { status: 200 });
    } catch {
      return data({ error: "Something went wrong" }, { status: 500 });
    }
  }

  if (intent === "contribution") {
    const id = fd.get("id") as string;
    const contributionDelta = Number(fd.get("contribution"));
    const currentAmount = Number(fd.get("current_amount") ?? 0);
    const total = currentAmount + contributionDelta;

    try {
      const response = await fetch(`${baseUrl}/auth/v1/goals/contribute`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ goal_id: Number(id), contribution: total }),
      }).then((r) => r.json());
      return data({ data: response }, { status: 200 });
    } catch {
      return data({ error: "Something went wrong" }, { status: 500 });
    }
  }

  if (intent === "delete") {
    const id = fd.get("id") as string;
    try {
      await fetch(`${baseUrl}/auth/v1/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return data({ success: true }, { status: 200 });
    } catch {
      return data({ error: "Delete failed" }, { status: 500 });
    }
  }
}

export default function Goals({ loaderData }: Route.ComponentProps) {
  const {
    data: goals,
    status,
    dataOverview,
    milestones,
  } = (loaderData as unknown as LoaderData) || {
    data: null,
    dataOverview: null,
    milestones: [],
    status: false,
  };

  return (
    <div className="space-y-6">
      <Header
        title="Financial Goals"
        subtitle="Track progress toward your savings targets"
      >
        <Modal label="+ New Goal">
          <GoalsFields />
        </Modal>
      </Header>
      <GoalsOverview
        total_goals={dataOverview?.total_goals ?? 0}
        savings={dataOverview?.savings ?? 0}
      />
      <div className="grid grid-cols-6 gap-6">
        <GoalsList data={goals} />
        <GoalsMilestone data={milestones ?? []} />
      </div>
    </div>
  );
}
