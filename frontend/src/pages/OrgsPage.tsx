import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrgCard from "../components/OrgCard";

interface Org {
    id: number;
    name: string;
    acronym: string;
    description: string;
}

const OrgsPage = () => {
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/orgs/")
            .then((res) => res.json())
            .then((data) => {
                setOrgs(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = orgs.filter(
        (org) =>
            org.name.toLowerCase().includes(search.toLowerCase()) ||
            org.acronym.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ padding: "20px" }}>
                {[1, 2, 3].map((n) => (
                    <div key={n} style={{ background: "#e0e0e0", height: "100px", marginBottom: "10px", borderRadius: "8px" }} />
                ))}
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Link to="/" style={{ fontSize: "0.9em" }}>&larr; Back to Home</Link>
            <h1>Organizations</h1>
            <input
                type="text"
                placeholder="Search by name or acronym..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: "20px", padding: "8px", width: "100%" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {filtered.map((org) => (
                    <OrgCard
                        key={org.id}
                        id={org.id}
                        name={org.name}
                        acronym={org.acronym}
                        description={org.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrgsPage;