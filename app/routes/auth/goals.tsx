import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import GoalsOverview from "../../lib/components/section/goals/GoalsOverview";
import GoalsList from "~/lib/components/section/goals/GoalsList";
import GoalsMilestone from "../../lib/components/section/goals/GoalsMilestone";
import { GoalsFields } from "~/lib/components/section/goals/GoalsForm";

export default function Goals() {
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
      <GoalsOverview />
      <div className="grid grid-cols-6 gap-6">
        <GoalsList />
        <GoalsMilestone />
      </div>
    </div>
  );
}
