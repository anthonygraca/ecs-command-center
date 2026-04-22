import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OrgsPage from "./pages/OrgsPage";
import OrgDetailPage from "./pages/OrgDetailPage";
import ClubOfficerPage from "./pages/ClubOfficerPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/orgs" element={<OrgsPage />} />
            <Route path="/orgs/:id" element={<OrgDetailPage />} />
            <Route path="/club-officer" element={<ClubOfficerPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
}

export default App;