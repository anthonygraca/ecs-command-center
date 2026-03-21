import { type EventData } from "../types/event";

interface EventCardProps {
  event: EventData;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const statusColors: Record<string, string> = {
  Pending: "#ffc107",
  Approved: "#28a745",
  Rejected: "#dc3545",
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleString();
}

const EventCard = ({ event, isExpanded, onToggle, onApprove, onReject }: EventCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        marginBottom: "8px",
        overflow: "hidden",
      }}
    >
      {/* Collapsed header - always visible */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: "bold" }}>{event.title}</span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "0.8em",
              backgroundColor: statusColors[event.approval_status] || "#888",
              color: "#000",
            }}
          >
            {event.approval_status}
          </span>
          {event.org_name && (
            <span style={{ color: "#aaa", fontSize: "0.9em" }}>{event.org_name}</span>
          )}
        </div>
        <span style={{ fontSize: "1.2em" }}>{isExpanded ? "\u25B2" : "\u25BC"}</span>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #333" }}>
          {event.description && (
            <p style={{ marginTop: "12px" }}>{event.description}</p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.9em", color: "#2a2a2a", marginTop: "8px" }}>
            <div>
              <strong>Start:</strong> {formatDateTime(event.start_time)}
            </div>
            <div>
              <strong>End:</strong> {formatDateTime(event.end_time)}
            </div>
            <div>
              <strong>Location:</strong> {event.location || "TBD"}
            </div>
            <div>
              <strong>Submitted by:</strong> {event.submitter_name || "Unknown"}
            </div>
          </div>
          {event.rejection_reason && (
            <p style={{ color: "#dc3545", marginTop: "8px" }}>
              <strong>Rejection reason:</strong> {event.rejection_reason}
            </p>
          )}
          {event.approval_status === "Pending" && (
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(event.id); }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Deny
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(event.id); }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Approve
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
