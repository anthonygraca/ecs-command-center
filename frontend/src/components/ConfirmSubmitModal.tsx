interface ConfirmSubmitModalProps {
  amount: number;
  submitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const ConfirmSubmitModal = ({ amount, submitting, onConfirm, onCancel }: ConfirmSubmitModalProps) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={submitting ? undefined : onCancel}
    >
      <div
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "480px",
          width: "90%",
          border: "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Confirm Submission</h3>
        <p>
          Are you sure you want to submit this request for{" "}
          <strong>{formatCurrency(amount)}</strong>?
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "16px" }}>
          <button
            onClick={onCancel}
            disabled={submitting}
            style={{ padding: "8px 16px" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmitModal;
