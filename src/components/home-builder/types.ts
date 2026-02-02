export interface HomeItem {
  id: string;
  couple_id: string;
  name: string;
  room: string;
  item_type: string;
  estimated_price: number;
  actual_price: number;
  status: "pending" | "purchased";
  priority: "low" | "medium" | "high";
  store_link: string | null;
  image_url: string | null;
  notes: string | null;
  purchased_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ViewMode = "grid" | "list";
export type FilterRoom = string | "all";
export type FilterType = string | "all";
export type FilterStatus = "all" | "pending" | "purchased";
