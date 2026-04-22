import { useState } from "react";
import type { BudgetData, CreateBudgetRequestBody } from "../types/budget";
import { BUDGET_CATEGORIES, DEV_ORG_ID, DEV_USER_ID } from "../constants/devUser";
import ConfirmSubmitModal from "./ConfirmSubmitModal";

const JUSTIFICATION_MIN = 20;

interface BudgetRequestFormProps {
  onSubmitted: (budget: BudgetData) => void;
}

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: "4px",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-input-bg)",
  color: "var(--color-text)",
  fontSize: "0.95em",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "4px",
  fontSize: "0.85em",
  color: "var(--color-text-secondary)",
  fontWeight: 500,
};

const BudgetRequestForm = ({ onSubmitted }: BudgetRequestFormProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount);
  const amountValid = !Number.isNaN(parsedAmount) && parsedAmount > 0;

  const reset = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setPurpose("");
  };

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!amountValid) {
      setError("Amount must be greater than 0.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    const body: CreateBudgetRequestBody = {
      org_id: DEV_ORG_ID,
      submitted_by_user_id: DEV_USER_ID,
      amount: parsedAmount,
      title,
      category,
      purpose,
    };
    try {
      const res = await fetch("/api/budgets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Submission failed (${res.status})`);
      }
      const created: BudgetData = await res.json();
      onSubmitted(created);
      reset();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "var(--color-bg-elevated)",
      }}
    >
      <h2 style={{ margin: "0 0 4px" }}>Budget Request</h2>
      <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", fontSize: "0.9em" }}>
        Submit a new budget request for approval
      </p>

      <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label style={labelStyle} htmlFor="budget-title">Request Title *</label>
          <input
            id="budget-title"
            type="text"
            required
            placeholder="e.g., Venue Rental, Catering Services"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="budget-amount">Amount *</label>
          <input
            id="budget-amount"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />
          <div style={{ fontSize: "0.8em", color: "var(--color-text-secondary)", marginTop: "4px" }}>
            Enter amount in USD (e.g., 1,250.00)
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="budget-category">Category *</label>
          <select
            id="budget-category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>Select category</option>
            {BUDGET_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle} htmlFor="budget-purpose">Justification *</label>
          <textarea
            id="budget-purpose"
            required
            minLength={JUSTIFICATION_MIN}
            rows={4}
            placeholder="Provide detailed justification for this budget request..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <div style={{ fontSize: "0.8em", color: "var(--color-text-secondary)", marginTop: "4px" }}>
            Minimum {JUSTIFICATION_MIN} characters
          </div>
        </div>

        {error && (
          <div style={{ color: "#dc3545", fontSize: "0.9em" }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Submit Request
          </button>
        </div>
      </form>

      {showModal && (
        <ConfirmSubmitModal
          amount={parsedAmount}
          submitting={submitting}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BudgetRequestForm;
