// TODO: replace with real auth context once user sessions exist.
// Values assume the DB has been seeded via backend/seed-organizations.py
// and backend/seed-budgets.py. DEV_USER_ID=2 is James Wilson (student) and
// DEV_ORG_ID=1 is AIAA — the first seeded org.
export const DEV_USER_ID = 2;
export const DEV_ORG_ID = 1;

export const BUDGET_CATEGORIES = [
  "Venue",
  "Catering",
  "Equipment",
  "Marketing",
  "Other",
] as const;

export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];
