import { Navigate, Outlet } from "react-router-dom";

function RoleRoute({ allowedRoles }) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
}

export default RoleRoute;