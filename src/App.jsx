import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmpleadosPage from "./pages/EmpleadosPage";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/empleados" element={<EmpleadosPage />} />
          <Route path="/dashboard" element={<div>Próximamente: Dashboard</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
