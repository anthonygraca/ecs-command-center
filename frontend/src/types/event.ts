export interface EventData {
  id: number;
  org_id: number;
  org_name: string | null;
  submitted_by_user_id: number | null;
  submitter_name: string | null;
  title: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  approval_status: "Pending" | "Approved" | "Rejected";
  rejection_reason: string | null;
}

export interface EventsResponse {
  events: EventData[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}
