import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h1>ECS Command Center</h1>
            <p style={{ color: "var(--color-text-secondary)" }}>Welcome! Select a section below to get started.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
                <Link to="/student" style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "24px" }}>
                        <h2 style={{ marginTop: 0 }}>Student Dashboard</h2>
                        <p style={{ color: "var(--color-text-secondary)" }}>Browse organizations and upcoming events</p>
                    </div>
                </Link>
                <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "24px" }}>
                        <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
                        <p style={{ color: "var(--color-text-secondary)" }}>Review and manage event proposals</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;