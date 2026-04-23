import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UpcomingEventCard from "../components/UpcomingEventCard";

interface UpcomingEvent {
    id: number;
    title: string;
    description: string | null;
    start_time: string | null;
    location: string | null;
    attendee_count: number;
}

const EventsPage = () => {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/events/upcoming")
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ padding: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {[1, 2, 3].map((n) => (
                        <div key={n} style={{ background: "var(--color-skeleton)", height: "280px", borderRadius: "8px" }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Link to="/" style={{ fontSize: "0.9em" }}>&larr; Back to Home</Link>
            <h1>Upcoming Events</h1>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px" }}>
                Don't miss out on exciting campus events
            </p>

            {events.length === 0 ? (
                <p style={{ color: "var(--color-text-secondary)" }}>No upcoming events right now — check back soon!</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {events.map((event) => (
                        <UpcomingEventCard
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            description={event.description}
                            start_time={event.start_time}
                            location={event.location}
                            attendee_count={event.attendee_count}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsPage;