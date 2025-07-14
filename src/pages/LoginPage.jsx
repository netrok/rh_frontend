import { useState } from "react";
import { Box, Button, Container, TextField, Typography, Snackbar } from "@mui/material";
import axios from "axios";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [snackbar, setSnackbar] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/token/", form);
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    // Extraer el rol desde el token
    const payload = JSON.parse(atob(response.data.access.split(".")[1]));
    localStorage.setItem("role", payload.role);

    window.location.href = "/empleados";
  } catch (err) {
    console.error(err);
    setSnackbar("Credenciales incorrectas");
  }
};

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom align="center">
        Iniciar Sesión
      </Typography>
      <TextField
        fullWidth
        label="Usuario"
        name="username"
        value={form.username}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        margin="normal"
      />
      <Box mt={2}>
        <Button fullWidth variant="contained" onClick={handleLogin}>
          Ingresar
        </Button>
      </Box>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar("")}
        message={snackbar}
      />
    </Container>
  );
}

export default LoginPage;