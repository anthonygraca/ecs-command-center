import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrgCard from "../components/OrgCard";
import UpcomingEventCard from "../components/UpcomingEventCard";

interface Org {
    id: number;
    name: string;
    acronym: string;
    description: string;
}

interface UpcomingEvent {
    id: number;
    title: string;
    description: string | null;
    start_time: string | null;
    location: string | null;
    attendee_count: number;
}

const StudentPage = () => {
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [orgsLoading, setOrgsLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/orgs/")
            .then((res) => res.json())
            .then((data) => {
                setOrgs(data);
                setOrgsLoading(false);
            })
            .catch(() => setOrgsLoading(false));

        fetch("/api/events/upcoming")
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
                setEventsLoading(false);
            })
            .catch(() => setEventsLoading(false));
    }, []);

    const filteredOrgs = orgs.filter(
        (org) =>
            org.name.toLowerCase().includes(search.toLowerCase()) ||
            org.acronym.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
            <Link to="/" style={{ fontSize: "0.85em" }}>&larr; Back to Home</Link>

            {/* Organizations Section */}
            <div style={{ marginBottom: "48px", marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "1.6em" }}>Organizations</h2>
                        <p style={{ color: "var(--color-text-secondary)", margin: "4px 0 12px", fontSize: "0.9em" }}>
                            Discover and join student organizations on campus
                        </p>
                    </div>
                    <Link to="/orgs" style={{ fontSize: "0.85em", border: "1px solid var(--color-border)", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", color: "var(--color-text)" }}>
                        View All Orgs
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Search organizations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: "16px", padding: "8px 12px", width: "100%", borderRadius: "6px", boxSizing: "border-box", fontSize: "0.9em" }}
                />

                {orgsLoading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} style={{ background: "var(--color-skeleton)", height: "140px", borderRadius: "8px" }} />
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {filteredOrgs.slice(0, 6).map((org) => (
                            <OrgCard
                                key={org.id}
                                id={org.id}
                                name={org.name}
                                acronym={org.acronym}
                                description={org.description}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Upcoming Events Section */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "1.6em" }}>Upcoming Events</h2>
                        <p style={{ color: "var(--color-text-secondary)", margin: "4px 0 16px", fontSize: "0.9em" }}>
                            Don't miss out on exciting campus events
                        </p>
                    </div>
                    <Link to="/events" style={{ fontSize: "0.85em", border: "1px solid var(--color-border)", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", color: "var(--color-text)" }}>
                        View All Events
                    </Link>
                </div>

                {eventsLoading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {[1, 2, 3].map((n) => (
                            <div key={n} style={{ background: "var(--color-skeleton)", height: "280px", borderRadius: "8px" }} />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9em" }}>No upcoming events right now — check back soon!</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {events.slice(0, 3).map((event) => (
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

        </div>
    );
};

export default StudentPage;