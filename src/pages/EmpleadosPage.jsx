import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api/axiosInstance"; // ajusta esta ruta si es necesario

function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState("");
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("activos");

  const [form, setForm] = useState({
    num_empleado: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    fecha_nacimiento: "",
    genero: "",
    estado_civil: "",
    curp: "",
    rfc: "",
    nss: "",
    telefono: "",
    email: "",
    puesto: "",
    departamento: "",
    fecha_ingreso: "",
    activo: true,
  });

  const fetchEmpleados = async () => {
    try {
      const response = await API.get("/empleados/");
      setEmpleados(response.data.results || response.data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "");
      if (soloNumeros.length <= 10) {
        setForm((prev) => ({ ...prev, [name]: soloNumeros }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFotoPreview(null);
    }
  };

  const handleGuardar = async () => {
    try {
      const url = empleadoEditando
        ? `/empleados/${empleadoEditando.id}/`
        : "/empleados/";

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
        } else {
          formData.append(key, value);
        }
      });
      if (fotoFile) formData.append("foto", fotoFile);

      const method = empleadoEditando ? "put" : "post";
      await API({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar("Empleado guardado con éxito");
      setMostrarModal(false);
      setFotoFile(null);
      setFotoPreview(null);
      fetchEmpleados();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el empleado");
    }
  };

  const handleToggleActivo = async (id, nuevoEstado) => {
    try {
      await API.patch(`/empleados/${id}/`, { activo: nuevoEstado });
      setSnackbar(`Empleado ${nuevoEstado ? "activado" : "inactivado"}`);
      fetchEmpleados();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estado del empleado");
    }
  };

  const openAgregar = () => {
    setEmpleadoEditando(null);
    setForm({
      num_empleado: "",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      fecha_nacimiento: "",
      genero: "",
      estado_civil: "",
      curp: "",
      rfc: "",
      nss: "",
      telefono: "",
      email: "",
      puesto: "",
      departamento: "",
      fecha_ingreso: "",
      activo: true,
    });
    setFotoFile(null);
    setFotoPreview(null);
    setMostrarModal(true);
  };

  const openEditar = (emp) => {
    setEmpleadoEditando(emp);
    setForm({ ...emp });
    setFotoPreview(emp.foto || null);
    setMostrarModal(true);
  };

  const empleadosFiltrados = empleados
    .filter((emp) =>
      filtroActivo === "todos"
        ? true
        : filtroActivo === "activos"
        ? emp.activo
        : !emp.activo
    )
    .filter((emp) =>
      `${emp.nombres} ${emp.apellido_paterno}`.toLowerCase().includes(filtroNombre.toLowerCase())
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            size="small"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <ToggleButtonGroup
            size="small"
            value={filtroActivo}
            exclusive
            onChange={(e, val) => val && setFiltroActivo(val)}
          >
            <ToggleButton value="activos">Activos</ToggleButton>
            <ToggleButton value="inactivos">Inactivos</ToggleButton>
            <ToggleButton value="todos">Todos</ToggleButton>
          </ToggleButtonGroup>
        </Box>
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
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleadosFiltrados.map((emp, idx) => (
              <TableRow key={emp.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  {emp.nombres} {emp.apellido_paterno}
                </TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.departamento}</TableCell>
                <TableCell>{emp.activo ? "Activo" : "Inactivo"}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => openEditar(emp)}>
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color={emp.activo ? "error" : "success"}
                    onClick={() => handleToggleActivo(emp.id, !emp.activo)}
                  >
                    {emp.activo ? "Inactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={mostrarModal} onClose={() => setMostrarModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{empleadoEditando ? "Editar Empleado" : "Agregar Empleado"}</DialogTitle>
        <DialogContent sx={{ pt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {Object.entries(form).map(([key, value]) => {
            if (key === "telefono") return null;
            if (typeof value === "boolean") return null;
            return (
              <TextField
                key={key}
                name={key}
                label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                value={value}
                onChange={handleChange}
                type={key.includes("fecha") ? "date" : "text"}
                InputLabelProps={key.includes("fecha") ? { shrink: true } : undefined}
                fullWidth
              />
            );
          })}
          <TextField
            name="telefono"
            label="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            inputProps={{ maxLength: 10 }}
            fullWidth
          />
          <FormControlLabel
            control={<Checkbox checked={form.activo} onChange={handleChange} name="activo" />}
            label="Activo"
          />
          <Button variant="outlined" component="label">
            Subir Foto
            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
          </Button>
          {fotoPreview && (
            <Box
              component="img"
              src={fotoPreview}
              sx={{ width: 120, height: 120, objectFit: "cover", borderRadius: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar}>
            Guardar
          </Button>
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