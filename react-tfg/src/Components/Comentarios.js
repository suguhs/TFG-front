import React, { useState, useEffect } from 'react';
import axiosCliente from './AxiosCliente';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]); // lista de comentarios
  const [contenido, setContenido] = useState(''); // lo que escribe el usuario
  const [usuario, setUsuario] = useState(null); // el usuario que está logueado
  const [error, setError] = useState(''); // para mostrar errores si pasa algo

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario')); // cogemos el usuario si está guardado
    if (user) setUsuario(user);
    obtenerComentarios(); // cargamos los comentarios al entrar
  }, []);

  // Función para obtener los comentarios del servidor
  const obtenerComentarios = async () => {
    try {
      const res = await axiosCliente.get('/comentarios');
      setComentarios(res.data); // guardamos los comentarios que llegan
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  };

  // Cuando el usuario envía un comentario nuevo
  const enviarComentario = async (e) => {
    e.preventDefault();
    setError('');

    // Si no hay sesión iniciada, mostramos aviso
    if (!usuario) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }

    try {
      // Enviamos el comentario al backend
      const res = await axiosCliente.post('/comentarios', {
        usuario_id: usuario.id_usuario,
        contenido: contenido
      });

      // Añadimos el nuevo comentario al principio de la lista
      setComentarios([res.data.comentario, ...comentarios]);
      setContenido(''); // limpiamos el textarea
    } catch (err) {
      // Si hay errores de validación los mostramos
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(' '));
      } else {
        setError('Error al enviar comentario.');
      }
    }
  };

  // Eliminar comentario (si eres el autor o admin)
  const eliminarComentario = async (id) => {
    try {
      await axiosCliente.delete(`/comentarios/${id}`);
      setComentarios(comentarios.filter(c => c.id !== id));
    } catch (err) {
      alert('❌ No tienes permiso para eliminar este comentario.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 d-flex align-items-center">
        <i className="bi bi-chat-dots me-2 fs-4"></i> Comentarios ({comentarios.length})
      </h2>

      {/* Si hay sesión, mostramos el formulario para comentar */}
      {usuario ? (
        <form onSubmit={enviarComentario} className="mb-4">
          <div className="mb-2">
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="form-control"
              rows="3"
              placeholder="Escribe tu comentario..."
            />
          </div>
          {error && <div className="text-danger mb-2">{error}</div>}
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
      ) : (
        // Si no hay sesión, mostramos un aviso
        <div className="alert alert-secondary text-center">
          🔒 <a href="/login">Inicia sesión</a> para dejar un comentario.
        </div>
      )}

      {/* Si no hay comentarios, lo mostramos */}
      {comentarios.length === 0 ? (
        <p className="text-muted text-center">Aún no hay comentarios.</p>
      ) : (
        // Si hay, los mostramos en una lista
        <ul className="list-unstyled">
          {comentarios.map((comentario) => (
            <li
              key={comentario.id}
              className="p-3 mb-3 bg-white rounded shadow-sm border"
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong className="text-dark">{comentario.usuario?.nombre || 'Usuario'}:</strong>
                  <p className="mb-1 mt-1">{comentario.contenido}</p>
                  <small className="text-muted">
                    {new Date(comentario.created_at).toLocaleString()}
                  </small>
                </div>

                {/* Solo el autor o admin puede eliminar el comentario */}
                {(usuario && (comentario.usuario_id === usuario.id_usuario || usuario.rol === 'admin')) && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => eliminarComentario(comentario.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comentarios;
