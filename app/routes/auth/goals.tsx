import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import GoalsOverview from "../../lib/components/section/goals/GoalsOverview";
import GoalsList from "~/lib/components/section/goals/GoalsList";
import GoalsMilestone from "../../lib/components/section/goals/GoalsMilestone";
import { GoalsFields } from "~/lib/components/section/goals/GoalsForm";
import type { Route } from "../+types/layout";
import { data } from "react-router";
import tokenParser from "~/lib/utils/tokenParser";
import { addContribution, createGoals } from "./actions";

interface LoaderData {
  data: Goal[] | null;
  dataOverview: GoalOverview | null;
  status: boolean;
  errors: string | null;
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { token } = tokenParser(request);
    const baseUrl = process.env.VITE_REACT_BASE_API_URL;
    const response: { data: Goal[] } = await fetch(`${baseUrl}/auth/v1/goals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((val) => val.json());

    const responseGoalsOverview: { data: GoalOverview } = await fetch(
      `${baseUrl}/auth/v1/goals/overview`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((val) => val.json());

    return {
      data: response.data,
      dataOverview: responseGoalsOverview.data,
      status: true,
    };
  } catch (err) {
    console.log(err);
    return { status: false, data: null, dataOverview: null };
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
    const response = await addContribution(formData, token);
    if (response?.status === 500) {
      return data({ error: "Something went wrong" }, { status: 500 });
    }
    if (response?.status === 200) {
      return data({ data: response.data }, { status: 200 });
    }
  }
}

export default function Goals({ loaderData }: Route.ComponentProps) {
  const { data, status, dataOverview } =
    (loaderData as unknown as LoaderData) || {
      data: null,
      dataOverview: null,
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
        <GoalsList data={data} />
        <GoalsMilestone data={dataOverview?.goals} />
      </div>
    </div>
  );
}
