import { Routes, Route } from "react-router-dom";
import OrgsPage from "./pages/OrgsPage";
import OrgDetailPage from "./pages/OrgDetailPage";

function App() {
    return (
        <Routes>
            <Route path="/orgs" element={<OrgsPage />} />
            <Route path="/orgs/:id" element={<OrgDetailPage />} />
        </Routes>
    );
}

export default App;