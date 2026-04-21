import { useState, useEffect } from "react";

interface UpcomingEventCardProps {
    id: number;
    title: string;
    description: string | null;
    start_time: string | null;
    location: string | null;
    attendee_count: number;
}

function formatDateTime(iso: string | null): string {
    if (!iso) return "TBD";
    return new Date(iso).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

const UpcomingEventCard = ({ id, title, description, start_time, location: _location, attendee_count }: UpcomingEventCardProps) => {
    const [attending, setAttending] = useState(false);
    const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/events/${id}/rsvp/status`)
            .then((res) => res.json())
            .then((data) => setAttending(data.attending))
            .catch(() => {});
    }, [id]);

    const showToast = (message: string, success: boolean) => {
        setToast({ message, success });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRsvp = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/events/${id}/rsvp`, { method: "POST" });
            if (res.ok) {
                setAttending(true);
                showToast("RSVP Confirmed!", true);
            } else {
                showToast("Failed to RSVP, please try again", false);
            }
        } catch {
            showToast("Failed to RSVP, please try again", false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ background: "var(--color-skeleton)", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85em", color: "var(--color-text-secondary)" }}>
                Event Image
            </div>

            <div style={{ padding: "14px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "0.8em", color: "var(--color-text-secondary)" }}>
                    📅 {formatDateTime(start_time)}
                </p>

                <h3 style={{ margin: "0 0 6px", fontSize: "1em", fontWeight: "600" }}>{title}</h3>

                {description && (
                    <p style={{ margin: "0 0 10px", fontSize: "0.82em", color: "var(--color-text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {description}
                    </p>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                    <span style={{ fontSize: "0.8em", color: "var(--color-text-secondary)" }}>
                        👥 {attendee_count} attending
                    </span>
                    <button
                        onClick={handleRsvp}
                        disabled={attending || loading}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: attending ? "default" : "pointer",
                            backgroundColor: attending ? "#6c757d" : "var(--color-bg-elevated)",
                            color: attending ? "white" : "var(--color-text)",
                            fontWeight: "600",
                            fontSize: "0.82em",
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        {attending ? "✓ Attending" : loading ? "..." : "RSVP"}
                    </button>
                </div>
            </div>

            {toast && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    backgroundColor: toast.success ? "#28a745" : "#dc3545",
                    color: "white",
                    fontWeight: "bold",
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    fontSize: "0.9em",
                }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default UpcomingEventCard;