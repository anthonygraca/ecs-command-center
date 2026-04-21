import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface OrgCardDetails {
    id: number;
    name: string;
    acronym: string;
    description: string;
}

const OrgCard = ({ id, name, acronym, description }: OrgCardDetails) => {
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);

    // check if the user already joined so the button shows attending
    useEffect(() => {
        fetch(`/api/orgs/${id}/join/status`)
            .then((res) => res.json())
            .then((data) => setJoined(data.joined))
            .catch(() => {});
    }, [id]);

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/orgs/${id}/join`, { method: "POST" });
            if (res.ok) {
                setJoined(true);
            }
        } catch {
            // silently fail for now
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link to={`/orgs/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "16px", height: "100%", boxSizing: "border-box" }}>
                {/* logo placeholder */}
                <div style={{ width: "40px", height: "40px", background: "var(--color-skeleton)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7em", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                    Logo
                </div>

                <h3 style={{ margin: "0 0 6px", fontSize: "1em", fontWeight: "600" }}>{name}</h3>
                <p style={{ margin: "0 0 12px", fontSize: "0.82em", color: "var(--color-text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {description}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                    <span style={{ fontSize: "0.8em", color: "var(--color-text-secondary)" }}>{acronym}</span>
                    <button
                        onClick={handleJoin}
                        disabled={joined || loading}
                        style={{
                            padding: "5px 14px",
                            fontSize: "0.82em",
                            backgroundColor: joined ? "#6c757d" : "var(--color-bg-elevated)",
                            color: joined ? "white" : "var(--color-text)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "6px",
                            cursor: joined ? "default" : "pointer",
                            fontWeight: "600",
                        }}
                    >
                        {joined ? "✓ Joined" : loading ? "..." : "Join"}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default OrgCard;