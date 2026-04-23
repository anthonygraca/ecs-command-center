import { useEffect, useState } from "react";
import type { BudgetData, BudgetsResponse } from "../types/budget";
import { DEV_USER_ID } from "../constants/devUser";

interface RecentBudgetRequestsProps {
  extraRequests: BudgetData[];
}

const statusColors: Record<string, string> = {
  Pending: "#ffc107",
  Approved: "#28a745",
  Denied: "#dc3545",
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const RecentBudgetRequests = ({ extraRequests }: RecentBudgetRequestsProps) => {
  const [fetched, setFetched] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: extend GET /api/budgets/ to filter by submitted_by_user_id so
    // we don't over-fetch. For now we filter client-side.
    fetch("/api/budgets/?per_page=100")
      .then((res) => res.json())
      .then((data: BudgetsResponse) => {
        setFetched(data.budgets.filter((b) => b.submitted_by_user_id === DEV_USER_ID));
      })
      .catch((err) => console.error("Failed to fetch budget requests:", err))
      .finally(() => setLoading(false));
  }, []);

  // Prepend newly submitted rows; de-dupe in case a later refetch returns them.
  const extraIds = new Set(extraRequests.map((b) => b.id));
  const combined = [...extraRequests, ...fetched.filter((b) => !extraIds.has(b.id))];

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ margin: "0 0 4px" }}>Recent Budget Requests</h2>
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "0.9em" }}>
          Track and manage your budget submissions
        </p>
      </div>

      {loading ? (
        <p>Loading budget requests...</p>
      ) : combined.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>
          No budget requests yet. Submit one above to get started.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Request ID", "Title", "Category", "Amount", "Date", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: "0.8em",
                    color: "var(--color-text-secondary)",
                    borderBottom: "1px solid var(--color-border)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {combined.map((b) => (
              <tr key={b.id}>
                <td style={cellStyle}>#BR-{b.id}</td>
                <td style={cellStyle}>{b.title || "—"}</td>
                <td style={cellStyle}>{b.category || "—"}</td>
                <td style={{ ...cellStyle, fontWeight: 500 }}>{formatCurrency(b.amount)}</td>
                <td style={{ ...cellStyle, fontSize: "0.9em", color: "var(--color-text-secondary)" }}>
                  {formatDate(b.created_at)}
                </td>
                <td style={cellStyle}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8em",
                      backgroundColor: statusColors[b.status] || "#888",
                      color: "#000",
                    }}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid var(--color-border-subtle)",
};

export default RecentBudgetRequests;
