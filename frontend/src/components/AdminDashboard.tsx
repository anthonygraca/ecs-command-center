import EventApprovalQueue from "./EventApprovalQueue";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Administrative Oversight</h1>
      <p style={{ color: "#aaa" }}>Review and manage pending event proposals</p>
      <EventApprovalQueue />
    </div>
  );
};

export default AdminDashboard;
