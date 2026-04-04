import { useState, useEffect, useCallback } from "react";
import type { BudgetData, BudgetsResponse, BudgetOrganization } from "../types/budget";
import Pagination from "./Pagination";

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatDate(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const BudgetReviewDashboard = () => {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [orgFilter, setOrgFilter] = useState<number | "">("");
  const [organizations, setOrganizations] = useState<BudgetOrganization[]>([]);

  const PER_PAGE = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch organizations for filter dropdown
  useEffect(() => {
    fetch("/api/budgets/organizations")
      .then((res) => res.json())
      .then((data: BudgetOrganization[]) => setOrganizations(data))
      .catch((err) => console.error("Failed to fetch organizations:", err));
  }, []);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      status: "Pending",
      page: String(page),
      per_page: String(PER_PAGE),
    });
    if (searchDebounced) params.set("search", searchDebounced);
    if (orgFilter) params.set("org_id", String(orgFilter));

    try {
      const res = await fetch(`/api/budgets/?${params}`);
      const data: BudgetsResponse = await res.json();
      setBudgets(data.budgets);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchDebounced, orgFilter]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchDebounced, orgFilter]);

  const handleApprove = async (id: number) => {
    const prevBudgets = budgets;
    const prevTotal = total;
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    setTotal((prev) => prev - 1);

    try {
      const res = await fetch(`/api/budgets/${id}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to approve");
    } catch {
      setBudgets(prevBudgets);
      setTotal(prevTotal);
    }
  };

  const handleDeny = async (id: number) => {
    const prevBudgets = budgets;
    const prevTotal = total;
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    setTotal((prev) => prev - 1);

    try {
      const res = await fetch(`/api/budgets/${id}/deny`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to deny");
    } catch {
      setBudgets(prevBudgets);
      setTotal(prevTotal);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px" }}>Budget Review Dashboard</h2>
          <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "0.9em" }}>
            Review and approve budget requests
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-input-bg)",
              color: "var(--color-text)",
              fontSize: "0.9em",
            }}
          />
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value ? Number(e.target.value) : "")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-input-bg)",
              color: "var(--color-text)",
              fontSize: "0.9em",
            }}
          >
            <option value="">All Organizations</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading budget requests...</p>
      ) : budgets.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>No pending budget requests found.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Organization", "Amount", "Purpose", "Submitter", "Date", "Actions"].map((h) => (
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
              {budgets.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--color-border-subtle)" }}>
                    {b.org_name || "\u2014"}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--color-border-subtle)", fontWeight: 500 }}>
                    {formatCurrency(b.amount)}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--color-border-subtle)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.purpose || "\u2014"}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--color-border-subtle)" }}>
                    {b.submitter_name || "\u2014"}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--color-border-subtle)", fontSize: "0.9em", color: "var(--color-text-secondary)" }}>
                    {formatDate(b.created_at)}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--color-border-subtle)" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => handleDeny(b.id)}
                        style={{
                          padding: "6px 14px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85em",
                        }}
                      >
                        Deny
                      </button>
                      <button
                        onClick={() => handleApprove(b.id)}
                        style={{
                          padding: "6px 14px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85em",
                        }}
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9em" }}>
              Showing {budgets.length} of {total} requests
            </span>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetReviewDashboard;
