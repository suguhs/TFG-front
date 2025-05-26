import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosCliente from './AxiosCliente'; // usamos el cliente con el token automático

function LoginForm() {
  const [gmail, setGmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // Función que se ejecuta cuando se envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      // Mandamos email y contraseña al backend
      const res = await axiosCliente.post('/login', {
        gmail,
        contraseña
      });

      // Guardamos los datos del usuario en localStorage (incluido el token)
      localStorage.setItem('usuario', JSON.stringify({
        ...res.data.usuario,
        token: res.data.access_token
      }));

      setMensaje('✅ Inicio de sesión exitoso');

      // Redirigimos a la página de inicio
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      // Si hay error, mostramos un mensaje claro
      if (error.response?.status === 401) {
        setMensaje('❌ Correo o contraseña incorrectos');
      } else {
        setMensaje('❌ Error al conectar con el servidor');
        console.error(error);
      }
    }
  };

  // Llevamos al usuario a la página de registro
  const irARegistro = () => {
    navigate('/registro');
  };

  return (
    <div className="d-flex justify-content-center align-items-center login-bg">
      <div className="card login-card">
        <div className="text-center mb-3">
          <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
          <h4 className="mt-2">Iniciar sesión</h4>
        </div>

        {/* Muestra mensajes de error o éxito */}
        {mensaje && (
          <div className={`alert ${mensaje.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-100">Entrar</button>
          <button type="button" className="btn btn-outline-secondary w-100" onClick={irARegistro}>
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
