import { useState, useEffect, useCallback } from "react";
import { type EventData, type EventsResponse } from "../types/event";
import EventCard from "./EventCard";
import RejectModal from "./RejectModal";
import Pagination from "./Pagination";

const EventApprovalQueue = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rejectingEvent, setRejectingEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", String(page));
    params.set("per_page", "10");

    try {
      const res = await fetch(`/api/events/?${params}`);
      const data: EventsResponse = await res.json();
      setEvents(data.events);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleApprove = async (id: number) => {
    await fetch(`/api/events/${id}/approve`, { method: "PATCH" });
    fetchEvents();
  };

  const handleRejectClick = (id: number) => {
    const event = events.find((e) => e.id === id);
    if (event) setRejectingEvent(event);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingEvent) return;
    await fetch(`/api/events/${rejectingEvent.id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rejection_reason: reason }),
    });
    setRejectingEvent(null);
    fetchEvents();
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>Event Approval Queue</h2>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
          }}
        >
          <option value="">All Events</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>No events found.</p>
      ) : (
        <>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isExpanded={expandedId === event.id}
              onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
              onApprove={handleApprove}
              onReject={handleRejectClick}
            />
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9em" }}>
              Showing {events.length} of {total}
            </span>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {rejectingEvent && (
        <RejectModal
          eventTitle={rejectingEvent.title}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectingEvent(null)}
        />
      )}
    </div>
  );
};

export default EventApprovalQueue;
