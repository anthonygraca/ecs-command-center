export interface BudgetData {
  id: number;
  org_id: number;
  org_name: string | null;
  submitted_by_user_id: number;
  submitter_name: string | null;
  amount: number;
  purpose: string | null;
  status: "Pending" | "Approved" | "Denied";
  created_at: string | null;
}

export interface BudgetsResponse {
  budgets: BudgetData[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface BudgetOrganization {
  id: number;
  name: string;
}
