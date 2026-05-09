import { useState } from "react";
import type { BudgetData } from "../types/budget";
import BudgetRequestForm from "../components/BudgetRequestForm";
import RecentBudgetRequests from "../components/RecentBudgetRequests";
import CreateEventForm from "../components/CreateEventForm";

interface PendingEvent {
    id: number;
    title: string;
    approval_status: string;
}

const ClubOfficerPage = () => {
    const [newRequests, setNewRequests] = useState<BudgetData[]>([]);
    const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
    const [activeTab, setActiveTab] = useState<"form" | "pending">("form");

    const handleEventSubmitted = (event: PendingEvent) => {
        setPendingEvents((prev) => [event, ...prev]);
        setActiveTab("pending");
    };

    const tabStyle = (tab: "form" | "pending") => ({
        padding: "8px 20px",
        borderRadius: "6px 6px 0 0",
        border: "1px solid var(--color-border)",
        borderBottom: activeTab === tab ? "1px solid var(--color-bg-elevated)" : "1px solid var(--color-border)",
        backgroundColor: activeTab === tab ? "var(--color-bg-elevated)" : "transparent",
        fontWeight: "600" as const,
        fontSize: "0.88em",
        cursor: "pointer",
        color: "var(--color-text)",
    });

    return (
        <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
                <h1 style={{ margin: "0 0 4px" }}>Club Officer</h1>
                <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                    Manage your club events and budget requests
                </p>
            </div>

            {/* two column layout matching wireframe */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* left column — create event with tabs */}
                <div>
                    <div style={{ display: "flex", gap: "0", marginBottom: "-1px" }}>
                        <button style={tabStyle("form")} onClick={() => setActiveTab("form")}>
                            Create Event
                        </button>
                        <button style={tabStyle("pending")} onClick={() => setActiveTab("pending")}>
                            Pending Approval {pendingEvents.length > 0 && `(${pendingEvents.length})`}
                        </button>
                    </div>

                    {activeTab === "form" && (
                        <CreateEventForm onSubmitted={handleEventSubmitted} />
                    )}

                    {activeTab === "pending" && (
                        <div style={{ border: "1px solid var(--color-border)", borderRadius: "0 8px 8px 8px", padding: "20px", backgroundColor: "var(--color-bg-elevated)" }}>
                            <h2 style={{ margin: "0 0 16px", fontSize: "1.1em" }}>Pending Approval</h2>
                            {pendingEvents.length === 0 ? (
                                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9em" }}>
                                    No events pending approval yet.
                                </p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {pendingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            style={{ padding: "12px 16px", border: "1px solid var(--color-border)", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                        >
                                            <span style={{ fontWeight: "600", fontSize: "0.9em" }}>{event.title}</span>
                                            <span style={{ fontSize: "0.78em", padding: "3px 10px", borderRadius: "12px", backgroundColor: "#fff3cd", color: "#856404", fontWeight: "600" }}>
                                                ⏳ Pending
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* right column — budget request form */}
                <BudgetRequestForm
                    onSubmitted={(budget) => setNewRequests((prev) => [budget, ...prev])}
                />
            </div>

            {/* recent budget requests table */}
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "20px", backgroundColor: "var(--color-bg-elevated)" }}>
                <RecentBudgetRequests extraRequests={newRequests} />
            </div>
        </div>
    );
};

export default ClubOfficerPage;