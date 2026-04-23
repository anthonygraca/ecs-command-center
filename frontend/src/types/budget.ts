export interface BudgetData {
  id: number;
  org_id: number;
  org_name: string | null;
  submitted_by_user_id: number;
  submitter_name: string | null;
  amount: number;
  title: string | null;
  category: string | null;
  purpose: string | null;
  status: "Pending" | "Approved" | "Denied";
  created_at: string | null;
}

export interface CreateBudgetRequestBody {
  org_id: number;
  submitted_by_user_id: number;
  amount: number;
  title: string;
  category: string;
  purpose: string;
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
