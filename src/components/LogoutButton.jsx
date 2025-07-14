import { Button } from "@mui/material";

function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return (
    <Button color="error" variant="outlined" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  );
}

export default LogoutButton;