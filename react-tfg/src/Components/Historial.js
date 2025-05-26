import React, { useEffect, useState } from 'react';
import axiosCliente from './AxiosCliente';

const Historial = () => {
  const [reservas, setReservas] = useState([]); // aquí guardamos lo que nos llega del backend
  const [modo, setModo] = useState('reservas'); // puede ser "reservas" o "pedidos"
  const [mostrarPendientes, setMostrarPendientes] = useState(false); // para filtrar solo los pendientes
  const [loading, setLoading] = useState(true); // para mostrar el spinner
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Esta función hace la petición al backend según el modo actual
  const cargarDatos = () => {
    setLoading(true); // activa el spinner

    // Elegimos la URL según si es admin y el modo seleccionado
    const url = modo === 'reservas'
      ? (usuario.rol === 'admin' ? '/historial-todas' : '/historial')
      : '/pedidos';

    axiosCliente.get(url)
      .then(res => setReservas(res.data))
      .catch(err => console.error('Error cargando historial:', err))
      .finally(() => setLoading(false)); // desactiva el spinner
  };

  // Esta función se usa para cambiar el estado de una reserva o pedido
  const cambiarEstado = (id, nuevoEstado) => {
    const endpoint = modo === 'reservas' ? `/reservas/${id}/estado` : `/pedidos/${id}/estado`;

    axiosCliente.post(endpoint, { estado: nuevoEstado })
      .then(() => cargarDatos()) // recargamos la lista al cambiar el estado
      .catch(err => console.error('Error actualizando estado:', err));
  };

  // Al montar el componente o cuando cambia el modo (reservas/pedidos), pedimos los datos
  useEffect(() => {
    if (usuario) cargarDatos();
  }, [modo]);

  // Si está activado el filtro, solo mostramos los pendientes
  const datosFiltrados = mostrarPendientes
    ? reservas.filter(r => r.estado === 'pendiente')
    : reservas;

  return (
    <div className="container mt-4">
      <h2>Historial de {modo === 'reservas' ? 'reservas' : 'pedidos a domicilio'}</h2>

      {/* Si es admin, mostramos los botones para cambiar entre modos y filtrar */}
      {usuario?.rol === 'admin' && (
        <div className="mb-3 d-flex gap-2 flex-wrap">
          <button
            className={`btn ${modo === 'reservas' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setModo('reservas')}
          >
            Ver reservas
          </button>
          <button
            className={`btn ${modo === 'pedidos' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setModo('pedidos')}
          >
            Ver pedidos a domicilio
          </button>
          <button
            className="btn btn-warning ms-auto"
            onClick={() => setMostrarPendientes(prev => !prev)}
          >
            {mostrarPendientes ? 'Ver todos' : 'Ver pendientes'}
          </button>
        </div>
      )}

      {/* Mostramos el spinner mientras carga */}
      {loading ? (
        <div className="d-flex flex-column align-items-center mt-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando historial...</span>
          </div>
          <p className="text-muted">Cargando historial...</p>
        </div>

      ) : datosFiltrados.length === 0 ? (

        // Si no hay resultados, lo decimos
        <p>No hay {modo === 'reservas' ? 'reservas' : 'pedidos'} registrados.</p>

      ) : (
        // Recorremos todos los datos filtrados y los mostramos
        datosFiltrados.map((dato) => (
          <div key={dato.reserva_id || dato.id_pedido} className="card mb-3">
            <div className="card-body">
              {/* Mostramos distinta info según si es reserva o pedido */}
              {modo === 'reservas' ? (
                <>
                  <h5>Fecha: {dato.fecha_reserva} - {dato.hora_reserva}</h5>
                  <p><strong>Personas:</strong> {dato.numero_personas}</p>
                </>
              ) : (
                <>
                  <h5>Dirección: {dato.direccion}</h5>
                  <p><strong>Total:</strong> {Number(dato.subtotal).toFixed(2)} €</p>
                </>
              )}

              {/* Si es admin, también mostramos los datos del cliente */}
              {usuario?.rol === 'admin' && (
                <>
                  <p><strong>Cliente:</strong> {dato.usuario?.nombre} {dato.usuario?.apellidos}</p>
                  <p><strong>Teléfono:</strong> {dato.usuario?.telefono}</p>
                </>
              )}

              <p><strong>Estado:</strong> {dato.estado}</p>

              {/* Lista de platos del pedido/reserva */}
              <ul>
                {(dato.detalles || []).map((d, index) => (
                  <li key={index}>
                    {d.plato?.nombre_plato || 'Plato eliminado'} x {d.cantidad}
                  </li>
                ))}
              </ul>

              {/* Botones para aceptar o rechazar (solo admin y si está pendiente) */}
              {usuario?.rol === 'admin' && dato.estado === 'pendiente' && (
                <div className="mt-3">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => cambiarEstado(dato.reserva_id || dato.id_pedido, 'aceptada')}
                  >
                    Aceptar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => cambiarEstado(dato.reserva_id || dato.id_pedido, 'rechazada')}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Historial;
