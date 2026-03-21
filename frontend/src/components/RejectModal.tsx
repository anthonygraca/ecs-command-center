import { useState } from "react";

interface RejectModalProps {
  eventTitle: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const RejectModal = ({ eventTitle, onConfirm, onCancel }: RejectModalProps) => {
  const [reason, setReason] = useState("");

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
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "480px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Reject Event</h3>
        <p>
          Rejecting: <strong>{eventTitle}</strong>
        </p>
        <textarea
          placeholder="Reason for rejection (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #444",
            backgroundColor: "#2a2a2a",
            color: "inherit",
            fontFamily: "inherit",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "16px" }}>
          <button onClick={onCancel} style={{ padding: "8px 16px" }}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
