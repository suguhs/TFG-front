import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosCliente from './AxiosCliente'; // usamos nuestro cliente con token incluido

function RegisterForm() {
  // Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    gmail: '',
    contraseña: '',
    telefono: '',
    rol: 'guest' // por defecto el rol es invitado
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // Cada vez que escribo en un campo, actualizo ese valor
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Cuando se envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      // Enviamos los datos al backend
      const res = await axiosCliente.post('/register', formData);

      setMensaje('✅ Usuario registrado correctamente.');

      // Vaciamos el formulario
      setFormData({
        nombre: '',
        apellidos: '',
        gmail: '',
        contraseña: '',
        telefono: '',
        rol: 'guest'
      });

      // Redirige al login después de 1 segundo
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {
      // Si el error es por validaciones, lo mostramos
      if (error.response?.status === 422 && error.response.data.errors) {
        const errores = Object.values(error.response.data.errors).flat().join('\n');
        setMensaje('❌ ' + errores);
      } else {
        setMensaje('❌ Error al conectar con el servidor.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center login-bg">
      <div className="card login-card">
        <div className="text-center mb-3">
          <i className="bi bi-person-plus-fill" style={{ fontSize: '2.5rem', color: '#0d6efd' }}></i>
          <h4 className="mt-2">Registro de Usuario</h4>
        </div>

        {/* Muestra el mensaje si hay algún error o éxito */}
        {mensaje && (
          <div className={`alert ${mensaje.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <input type="text" name="nombre" placeholder="Nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellidos" placeholder="Apellidos" className="form-control" value={formData.apellidos} onChange={handleChange} required />
          <input type="email" name="gmail" placeholder="Correo electrónico" className="form-control" value={formData.gmail} onChange={handleChange} required />
          <input type="password" name="contraseña" placeholder="Contraseña" className="form-control" value={formData.contraseña} onChange={handleChange} required />
          <input type="text" name="telefono" placeholder="Teléfono (opcional)" className="form-control" value={formData.telefono} onChange={handleChange} />

          <button type="submit" className="btn btn-success w-100">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
