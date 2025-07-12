import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function EmpleadoFormModal({ isOpen, onClose, onEmpleadoCreado, empleadoEditando }) {
  const [form, setForm] = useState({
    nombres: "",
    apellido_paterno: "",
    email: "",
    departamento: "",
  });

  useEffect(() => {
    if (empleadoEditando) {
      setForm({
        nombres: empleadoEditando.nombres || "",
        apellido_paterno: empleadoEditando.apellido_paterno || "",
        email: empleadoEditando.email || "",
        departamento: empleadoEditando.departamento || "",
      });
    } else {
      setForm({
        nombres: "",
        apellido_paterno: "",
        email: "",
        departamento: "",
      });
    }
  }, [empleadoEditando]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      <div className="bg-white rounded-xl shadow-lg p-6 z-20 w-full max-w-lg">
        <Dialog.Title className="text-xl font-bold mb-4">
          {empleadoEditando ? "Editar Empleado" : "Agregar Empleado"}
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombres"
            onChange={handleChange}
            value={form.nombres}
            placeholder="Nombres"
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="apellido_paterno"
            onChange={handleChange}
            value={form.apellido_paterno}
            placeholder="Apellido paterno"
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
            placeholder="Email"
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="departamento"
            onChange={handleChange}
            value={form.departamento}
            placeholder="Departamento"
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {empleadoEditando ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
