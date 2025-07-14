import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function EmpleadoFormModal({ isOpen, onClose, onEmpleadoCreado, empleadoEditando }) {
  const camposIniciales = {
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
  };

  const [form, setForm] = useState(camposIniciales);

  useEffect(() => {
    if (empleadoEditando) {
      setForm({
        ...camposIniciales,
        ...empleadoEditando,
      });
    } else {
      setForm(camposIniciales);
    }
  }, [empleadoEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    try {
      const url = empleadoEditando
        ? `http://127.0.0.1:8000/api/empleados/${empleadoEditando.id}/`
        : "http://127.0.0.1:8000/api/empleados/";

      const method = empleadoEditando ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        onEmpleadoCreado();
        onClose();
      } else {
        alert("Error al guardar el empleado.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="bg-white rounded-xl shadow-lg p-6 z-20 w-full max-w-3xl max-h-screen overflow-y-auto">
        <Dialog.Title className="text-xl font-bold mb-4">
          {empleadoEditando ? "Editar Empleado" : "Agregar Empleado"}
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="num_empleado" value={form.num_empleado} onChange={handleChange} placeholder="Número de empleado" className="border rounded px-3 py-2" />
          <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" className="border rounded px-3 py-2" required />
          <input name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} placeholder="Apellido paterno" className="border rounded px-3 py-2" />
          <input name="apellido_materno" value={form.apellido_materno} onChange={handleChange} placeholder="Apellido materno" className="border rounded px-3 py-2" />
          <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} className="border rounded px-3 py-2" />
          <select name="genero" value={form.genero} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="">Seleccionar género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <select name="estado_civil" value={form.estado_civil} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="">Estado civil</option>
            <option value="soltero">Soltero</option>
            <option value="casado">Casado</option>
            <option value="union_libre">Unión libre</option>
            <option value="divorciado">Divorciado</option>
          </select>
          <input name="curp" value={form.curp} onChange={handleChange} placeholder="CURP" className="border rounded px-3 py-2" />
          <input name="rfc" value={form.rfc} onChange={handleChange} placeholder="RFC" className="border rounded px-3 py-2" />
          <input name="nss" value={form.nss} onChange={handleChange} placeholder="NSS" className="border rounded px-3 py-2" />
          <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border rounded px-3 py-2" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border rounded px-3 py-2" required />
          <input name="puesto" value={form.puesto} onChange={handleChange} placeholder="Puesto" className="border rounded px-3 py-2" />
          <input name="departamento" value={form.departamento} onChange={handleChange} placeholder="Departamento" className="border rounded px-3 py-2" />
          <input type="date" name="fecha_ingreso" value={form.fecha_ingreso} onChange={handleChange} className="border rounded px-3 py-2" />
          <label className="flex items-center space-x-2 col-span-2">
            <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
            <span>Empleado activo</span>
          </label>

          <div className="flex justify-end gap-2 col-span-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {empleadoEditando ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}