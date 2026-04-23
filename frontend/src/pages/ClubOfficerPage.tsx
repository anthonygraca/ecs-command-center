import { useState } from "react";
import type { BudgetData } from "../types/budget";
import BudgetRequestForm from "../components/BudgetRequestForm";
import RecentBudgetRequests from "../components/RecentBudgetRequests";

const ClubOfficerPage = () => {
  const [newRequests, setNewRequests] = useState<BudgetData[]>([]);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ margin: "0 0 4px" }}>Club Officer</h1>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
          Submit budget requests for your organization
        </p>
      </div>

      <BudgetRequestForm
        onSubmitted={(budget) => setNewRequests((prev) => [budget, ...prev])}
      />

      <div
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "var(--color-bg-elevated)",
        }}
      >
        <RecentBudgetRequests extraRequests={newRequests} />
      </div>
    </div>
  );
};

export default ClubOfficerPage;
