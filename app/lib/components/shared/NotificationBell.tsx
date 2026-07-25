import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { getToken } from "~/lib/utils/tokenStore";
import { cn } from "~/lib/utils";

interface Notification {
  id: number;
  type: "BUDGET_WARNING" | "BUDGET_EXCEEDED" | "GOAL_DEADLINE" | "ANOMALY";
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: number | null;
  is_read: boolean;
  created_at: string;
}

const TYPE_LABEL: Record<Notification["type"], string> = {
  BUDGET_WARNING: "Budget Warning",
  BUDGET_EXCEEDED: "Budget Exceeded",
  GOAL_DEADLINE: "Goal Deadline",
  ANOMALY: "Anomaly Detected",
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";

  async function fetchNotifications() {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${baseApi}/auth/v1/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const body: { data: Notification[]; unread_count: number } = await res.json();
    setNotifications(body.data ?? []);
    setUnreadCount(body.unread_count ?? 0);
  }

  useEffect(() => {
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markAllRead() {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${baseApi}/auth/v1/notifications/read-all`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      toast.error("Failed to mark notifications as read");
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  async function markRead(id: number) {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${baseApi}/auth/v1/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      toast.error("Failed to mark notification as read");
      return;
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function deleteNotification(id: number) {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${baseApi}/auth/v1/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      toast.error("Failed to delete notification");
      return;
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) fetchNotifications(); }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-semibold text-sm">Notifications</p>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllRead}>
              <Check className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <div className="h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div key={n.id}>
                <div
                  className={cn(
                    "flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                    !n.is_read && "bg-muted/30"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        {TYPE_LABEL[n.type]}
                      </Badge>
                      {!n.is_read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(n.created_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {!n.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markRead(n.id)}
                        title="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-destructive"
                      onClick={() => deleteNotification(n.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
