import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useRole = () => {
  const { hasRole } = useContext(AuthContext);
  return { hasRole };
};