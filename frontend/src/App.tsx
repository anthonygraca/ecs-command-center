import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StudentPage from "./pages/StudentPage";
import OrgsPage from "./pages/OrgsPage";
import OrgDetailPage from "./pages/OrgDetailPage";
import ClubOfficerPage from "./pages/ClubOfficerPage";
import EventsPage from "./pages/EventsPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/student" element={<StudentPage />} />
			<Route path="/orgs" element={<OrgsPage />} />
			<Route path="/orgs/:id" element={<OrgDetailPage />} />
			<Route path="/club-officer" element={<ClubOfficerPage />} />
			<Route path="/events" element={<EventsPage />} />
			<Route path="/admin" element={<AdminDashboard />} />
		</Routes>
	);
}

export default App;
