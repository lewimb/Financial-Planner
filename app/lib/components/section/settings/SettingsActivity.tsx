import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import type { ActivityItem } from "~/lib/types/activity";

interface Props {
  items: ActivityItem[];
}

const ACTION_VARIANT: Record<ActivityItem["action"], "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  CONTRIBUTE: "outline",
  IMPORT: "outline",
};

export function SettingsActivity({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No activity yet.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, idx) => (
        <div key={item.id}>
          <div className="flex items-start gap-3 py-3">
            <Badge variant={ACTION_VARIANT[item.action]} className="mt-0.5 shrink-0 text-xs">
              {item.action}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{item.description}</p>
              <p className="text-xs text-muted-foreground">
                {item.entity_type}
                {item.entity_id !== null && ` #${item.entity_id}`}
              </p>
            </div>
            <p className="text-xs text-muted-foreground shrink-0">
              {new Date(item.created_at).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {idx < items.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
