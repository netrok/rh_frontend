import {
  Box, Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Paper, ToggleButtonGroup, ToggleButton, Alert, Collapse,
  IconButton, Chip, Avatar, Tooltip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState("");
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("activos");
  const [errores, setErrores] = useState({});


  const [form, setForm] = useState({
    num_empleado: "", nombres: "", apellido_paterno: "", apellido_materno: "",
    fecha_nacimiento: "", genero: "", estado_civil: "", curp: "", rfc: "",
    nss: "", telefono: "", email: "", puesto: "", departamento: "",
    fecha_ingreso: "", activo: true,
  });

  const camposTexto = [
    { name: "num_empleado", label: "Número de Empleado", max: 10 },
    { name: "nombres", label: "Nombres", max: 50 },
    { name: "apellido_paterno", label: "Apellido Paterno", max: 50 },
    { name: "apellido_materno", label: "Apellido Materno", max: 50 },
    { name: "curp", label: "CURP", max: 18 },
    { name: "rfc", label: "RFC", max: 13 },
    { name: "nss", label: "NSS", max: 11 },
    { name: "telefono", label: "Teléfono", max: 10 },
    { name: "email", label: "Correo Electrónico", max: 100 },
    { name: "puesto", label: "Puesto", max: 50 },
    { name: "departamento", label: "Departamento", max: 50 },
    { name: "genero", label: "Género", max: 10 },
    { name: "estado_civil", label: "Estado Civil", max: 20 },
  ];

  const camposFecha = ["fecha_nacimiento", "fecha_ingreso"];

  const fetchEmpleados = async () => {
    try {
      const response = await API.get("/empleados/");
      setEmpleados(response.data.results || response.data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  useEffect(() => { fetchEmpleados(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrores((prev) => ({ ...prev, [name]: null }));

    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "");
      if (soloNumeros.length <= 10) {
        setForm((prev) => ({ ...prev, [name]: soloNumeros }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file instanceof File ? file : null);
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
      const url = empleadoEditando ? `/empleados/${empleadoEditando.id}/` : "/empleados/";
      const method = empleadoEditando ? "put" : "post";

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, typeof value === "boolean" ? String(value) : value);
      });

      if (fotoFile instanceof File) {
        formData.append("foto", fotoFile);
      } else if (!empleadoEditando) {
        formData.append("foto", "");
      }

      await API({ method, url, data: formData, headers: { "Content-Type": "multipart/form-data" } });
      setSnackbar("Empleado guardado con éxito");
      setMostrarModal(false);
      setEmpleadoEditando(null);
      setFotoFile(null);
      setFotoPreview(null);
      setErrores({});
      fetchEmpleados();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) setErrores(errorData);
      else alert("Error inesperado: " + err.message);
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
      num_empleado: "", nombres: "", apellido_paterno: "", apellido_materno: "",
      fecha_nacimiento: "", genero: "", estado_civil: "", curp: "", rfc: "",
      nss: "", telefono: "", email: "", puesto: "", departamento: "",
      fecha_ingreso: "", activo: true,
    });
    setFotoFile(null);
    setFotoPreview(null);
    setErrores({});
    setMostrarModal(true);
  };

  const openEditar = (emp) => {
    setEmpleadoEditando(emp);
    setForm({
      num_empleado: emp.num_empleado || "", nombres: emp.nombres || "",
      apellido_paterno: emp.apellido_paterno || "", apellido_materno: emp.apellido_materno || "",
      fecha_nacimiento: emp.fecha_nacimiento || "", genero: emp.genero || "",
      estado_civil: emp.estado_civil || "", curp: emp.curp || "", rfc: emp.rfc || "",
      nss: emp.nss || "", telefono: emp.telefono || "", email: emp.email || "",
      puesto: emp.puesto || "", departamento: emp.departamento || "",
      fecha_ingreso: emp.fecha_ingreso || "", activo: emp.activo ?? true,
    });
    setFotoPreview(emp.foto || null);
    setFotoFile(null);
    setErrores({});
    setMostrarModal(true);
  };

  const exportarExcel = async () => {
    try {
      const response = await API.get("/empleados/exportar/excel/", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "empleados.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Error al exportar Excel");
    }
  };

  const exportarPDF = async () => {
    try {
      const response = await API.get("/empleados/exportar/pdf/", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "empleados.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Error al exportar PDF");
    }
  };


  const empleadosFiltrados = empleados
    .filter(emp => filtroActivo === "todos" ? true : filtroActivo === "activos" ? emp.activo : !emp.activo)
    .filter(emp => (`${emp.nombres} ${emp.apellido_paterno}`.toLowerCase().includes(filtroNombre.toLowerCase())));

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField label="Buscar por nombre" variant="outlined" size="small" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} />
          <ToggleButtonGroup size="small" value={filtroActivo} exclusive onChange={(e, val) => val && setFiltroActivo(val)}>
            <ToggleButton value="activos">Activos</ToggleButton>
            <ToggleButton value="inactivos">Inactivos</ToggleButton>
            <ToggleButton value="todos">Todos</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={exportarExcel} startIcon={<FileDownloadIcon />}>Excel</Button>
          <Button variant="outlined" onClick={exportarPDF} startIcon={<PictureAsPdfIcon />}>PDF</Button>
          <Button variant="contained" color="primary" onClick={openAgregar} startIcon={<PersonAddIcon />}>Agregar</Button>
        </Box>
      </Box>


      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
              <TableRow key={emp.id} hover>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={emp.foto} alt={emp.nombres} sx={{ width: 32, height: 32 }} />
                    {emp.nombres} {emp.apellido_paterno}
                  </Box>
                </TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.departamento}</TableCell>
                <TableCell>
                  <Chip
                    label={emp.activo ? "Activo" : "Inactivo"}
                    color={emp.activo ? "success" : "default"}
                    icon={emp.activo ? <CheckCircleIcon /> : <CancelIcon />}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <Button size="small" onClick={() => openEditar(emp)} startIcon={<EditIcon />}>Editar</Button>
                  </Tooltip>
                  <Tooltip title={emp.activo ? "Inactivar" : "Activar"}>
                    <Button
                      size="small"
                      color={emp.activo ? "error" : "success"}
                      onClick={() => handleToggleActivo(emp.id, !emp.activo)}
                      startIcon={emp.activo ? <CancelIcon /> : <CheckCircleIcon />}
                    >
                      {emp.activo ? "Inactivar" : "Activar"}
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={mostrarModal} onClose={() => setMostrarModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>{empleadoEditando ? "Editar Empleado" : "Agregar Empleado"}</DialogTitle>
        <DialogContent sx={{ pt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {camposTexto.map(({ name, label, max }) => (
            <TextField
              key={name}
              name={name}
              label={label}
              value={form[name] || ""}
              onChange={handleChange}
              inputProps={{ maxLength: max }}
              error={!!errores[name]}
              helperText={errores[name]?.[0] || ""}
              fullWidth
            />
          ))}
          {camposFecha.map((name) => (
            <TextField
              key={name}
              name={name}
              label={name.replace(/_/g, " ").toUpperCase()}
              type="date"
              value={form[name] || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errores[name]}
              helperText={errores[name]?.[0] || ""}
              fullWidth
            />
          ))}
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
          <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar("")} message={snackbar} />
      <Collapse in={Object.keys(errores).length > 0}>
        <Alert severity="error" sx={{ mt: 2 }}
          action={
            <IconButton color="inherit" size="small" onClick={() => setErrores({})}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          Algunos campos necesitan revisión. Corrige los errores marcados.
        </Alert>
      </Collapse>
    </Container>
  );
}

export default EmpleadosPage;
