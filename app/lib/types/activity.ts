export interface ActivityItem {
  id: number;
  action: "CREATE" | "UPDATE" | "DELETE" | "CONTRIBUTE" | "IMPORT";
  entity_type: string;
  entity_id: number | null;
  description: string;
  created_at: string;
}
