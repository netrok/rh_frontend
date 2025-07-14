import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    console.log("AuthContext: token encontrado =", token); // 🔍

    if (token) {
      try {
        const decoded = jwt_decode(token);
        console.log("AuthContext: decoded token =", decoded); // 🔍

        const extractedRoles = decoded.roles || decoded.authorities || [];
        console.log("AuthContext: roles extraídos =", extractedRoles); // 🔍

        setRoles(extractedRoles);
        setUser(decoded);
      } catch (err) {
        console.error("AuthContext: token inválido o corrupto", err);
        setRoles([]);
        setUser(null);
      }
    } else {
      console.warn("AuthContext: no hay token");
      setRoles([]);
      setUser(null);
    }
  }, []);

  const hasRole = (role) => roles.includes(role);

  return (
    <AuthContext.Provider value={{ roles, hasRole, user }}>
      {children}
    </AuthContext.Provider>
  );
};