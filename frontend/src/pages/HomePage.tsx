import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h1>ECS Command Center</h1>
            <p style={{ color: "#aaa" }}>Welcome! Select a section below to get started.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
                <Link to="/orgs" style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ border: "1px solid #444", borderRadius: "8px", padding: "24px" }}>
                        <h2 style={{ marginTop: 0 }}>Organizations</h2>
                        <p style={{ color: "#aaa" }}>Browse active student organizations</p>
                    </div>
                </Link>
                <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ border: "1px solid #444", borderRadius: "8px", padding: "24px" }}>
                        <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
                        <p style={{ color: "#aaa" }}>Review and manage event proposals</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
