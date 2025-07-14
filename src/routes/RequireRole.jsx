import { Navigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";

const RequireRole = ({ role, children }) => {
  const { hasRole } = useRole();
  return hasRole(role) ? children : <Navigate to="/unauthorized" />;
};

export default RequireRole;