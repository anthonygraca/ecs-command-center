import { Routes, Route } from "react-router-dom";
import OrgsPage from "./pages/OrgsPage";
import OrgDetailPage from "./pages/OrgDetailPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
    return (
        <Routes>
            <Route path="/orgs" element={<OrgsPage />} />
            <Route path="/orgs/:id" element={<OrgDetailPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
}

export default App;