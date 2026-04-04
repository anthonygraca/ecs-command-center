import { Link } from "react-router-dom";
import BudgetReviewDashboard from "./BudgetReviewDashboard";
import EventApprovalQueue from "./EventApprovalQueue";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <Link to="/" style={{ fontSize: "0.9em" }}>&larr; Back to Home</Link>
      <h1>Administrative Oversight</h1>
      <p style={{ color: "var(--color-text-secondary)" }}>Review and approve budget requests and event submissions</p>
      <BudgetReviewDashboard />
      <div style={{ marginTop: "40px" }} />
      <EventApprovalQueue />
    </div>
  );
};

export default AdminDashboard;
