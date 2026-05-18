import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import GoalsOverview from "../../lib/components/section/goals/GoalsOverview";
import GoalsList from "~/lib/components/section/goals/GoalsList";
import GoalsMilestone from "../../lib/components/section/goals/GoalsMilestone";
import type { Goal } from "~/lib/types/goals";
import { GoalsFields } from "~/lib/components/section/goals/GoalsForm";
import type { Route } from "../+types/layout";
import { data } from "react-router";
import tokenParser from "~/lib/utils/tokenParser";
import type { GoalOverview } from "~/lib/types/goals";
import { createGoals } from "./actions";

interface LoaderData {
  data: Goal[] | null;
  dataOverview: GoalOverview | null;
  milestones: Goal[] | null;
  status: boolean;
  errors: string | null;
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { token } = tokenParser(request);
    const baseUrl = process.env.VITE_REACT_BASE_API_URL;

    const [goalsRes, overviewRes, milestonesRes] = await Promise.all([
      fetch(`${baseUrl}/auth/v1/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((val) => val.json()),
      fetch(`${baseUrl}/auth/v1/goals/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((val) => val.json()),
      fetch(`${baseUrl}/auth/v1/goals/milestones`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((val) => val.json()),
    ]);

    return {
      data: goalsRes.data,
      dataOverview: overviewRes.data,
      milestones: Array.isArray(milestonesRes) ? milestonesRes : [],
      status: true,
    };
  } catch (err) {
    console.error(err);
    return { status: false, data: null, dataOverview: null, milestones: [] };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = request.formData();
  const { token } = tokenParser(request);
  const intent = (await formData).get("intent");

  if (intent === "post") {
    const response = await createGoals(formData, token);

    if (response?.status === 500) {
      return data({ error: "Something went wrong" }, { status: 500 });
    }
    if (response?.status === 400) {
      return data({ errors: response?.errors }, { status: 400 });
    }
    if (response?.status === 200) {
      return data({ data: response.data }, { status: 200 });
    }
  }

  if (intent === "contribution") {
    const fd = await formData;
    const id = fd.get("id") as string;
    const contributionDelta = Number(fd.get("contribution"));
    const currentAmount = Number(fd.get("current_amount") ?? 0);
    const total = currentAmount + contributionDelta;

    const baseUrl = process.env.VITE_REACT_BASE_API_URL;
    try {
      const response = await fetch(
        `${baseUrl}/auth/v1/goals/${id}/contribute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: total }),
        },
      ).then((val) => val.json());

      return data({ data: response }, { status: 200 });
    } catch {
      return data({ error: "Something went wrong" }, { status: 500 });
    }
  }

  if (intent === "delete") {
    const fd = await formData;
    const id = fd.get("id") as string;
    const baseUrl = process.env.VITE_REACT_BASE_API_URL;
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
