import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" color="error" gutterBottom>
        403 - Acceso Denegado
      </Typography>
      <Typography variant="body1" mb={4}>
        No tienes permisos para ver esta página.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Ir al inicio
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;