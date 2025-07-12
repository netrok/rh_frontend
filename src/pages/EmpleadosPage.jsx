import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [form, setForm] = useState({
    nombres: "",
    apellido_paterno: "",
    email: "",
    departamento: "",
  });
  const [snackbar, setSnackbar] = useState("");

  const fetchEmpleados = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://127.0.0.1:8000/api/empleados/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmpleados(response.data.results || response.data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem("access");
      const url = empleadoEditando
        ? `http://127.0.0.1:8000/api/empleados/${empleadoEditando.id}/`
        : "http://127.0.0.1:8000/api/empleados/";
      const method = empleadoEditando ? "put" : "post";

      await axios[method](url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbar("Empleado guardado con éxito");
      setMostrarModal(false);
      fetchEmpleados();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el empleado");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    try {
      const token = localStorage.getItem("access");
      await axios.delete(`http://127.0.0.1:8000/api/empleados/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar("Empleado eliminado");
      fetchEmpleados();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const openAgregar = () => {
    setEmpleadoEditando(null);
    setForm({
      nombres: "",
      apellido_paterno: "",
      email: "",
      departamento: "",
    });
    setMostrarModal(true);
  };

  const openEditar = (emp) => {
    setEmpleadoEditando(emp);
    setForm({
      nombres: emp.nombres,
      apellido_paterno: emp.apellido_paterno,
      email: emp.email,
      departamento: emp.departamento,
    });
    setMostrarModal(true);
  };

  const empleadosFiltrados = empleados.filter((emp) =>
    `${emp.nombres} ${emp.apellido_paterno}`.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          size="small"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={openAgregar}>
          + Agregar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleadosFiltrados.map((emp, idx) => (
              <TableRow key={emp.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{emp.nombres} {emp.apellido_paterno}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.departamento}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => openEditar(emp)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleEliminar(emp.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={mostrarModal} onClose={() => setMostrarModal(false)}>
        <DialogTitle>{empleadoEditando ? "Editar Empleado" : "Agregar Empleado"}</DialogTitle>
        <DialogContent sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField name="nombres" label="Nombres" value={form.nombres} onChange={handleChange} fullWidth />
          <TextField name="apellido_paterno" label="Apellido Paterno" value={form.apellido_paterno} onChange={handleChange} fullWidth />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth />
          <TextField name="departamento" label="Departamento" value={form.departamento} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar("")}
        message={snackbar}
      />
    </Container>
  );
}

export default EmpleadosPage;
