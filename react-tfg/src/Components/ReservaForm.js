import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosCliente from './AxiosCliente';

const ReservaForm = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Estado para guardar los datos del formulario
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [personas, setPersonas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [mesasDisponibles, setMesasDisponibles] = useState(null);

  // Saco la fecha de hoy para ponerla como valor mínimo
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Genero una lista con todas las horas en las que se puede reservar
  const generarHorasPermitidas = (fechaSeleccionada) => {
    const ahora = new Date();
    const margen = new Date(ahora.getTime() + 60 * 60 * 1000); // mínimo 1 hora desde ahora
    const hoy = obtenerFechaActual();
    const horas = [];

    // Horario de comidas
    for (let h = 13; h <= 16; h++) {
      horas.push(`${h.toString().padStart(2, '0')}:00`);
      if (h !== 16) horas.push(`${h.toString().padStart(2, '0')}:30`);
    }

    // Horario de cenas
    for (let h = 20; h <= 22; h++) {
      horas.push(`${h.toString().padStart(2, '0')}:00`);
      if (h !== 22) horas.push(`${h.toString().padStart(2, '0')}:30`);
    }

    // Si es hoy, quito las horas que ya han pasado o están muy cerca
    return horas.filter(horaTexto => {
      const horaCompleta = new Date(`${fechaSeleccionada}T${horaTexto}`);
      return fechaSeleccionada !== hoy || horaCompleta > margen;
    });
  };

  // Al cargar la página, pongo la fecha de hoy y calculo las horas disponibles
  useEffect(() => {
    const hoy = obtenerFechaActual();
    setFecha(hoy);
    setHorasDisponibles(generarHorasPermitidas(hoy));
  }, []);

  // Cuando cambia la fecha, vuelvo a calcular horas y pregunto las mesas libres
  useEffect(() => {
    if (fecha) {
      setHorasDisponibles(generarHorasPermitidas(fecha));

      axiosCliente
        .get(`/mesas-disponibles?fecha=${fecha}`)
        .then((res) => setMesasDisponibles(res.data.mesas_disponibles))
        .catch(() => setMesasDisponibles(null));
    }
  }, [fecha]);

  // Al enviar el formulario se intenta guardar la reserva
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si no hay usuario logueado, avisa
    if (!usuario) {
      setMensaje('❌ Debes iniciar sesión para reservar');
      return;
    }

    try {
      const res = await axiosCliente.post('/reservas', {
        id_usuario: usuario.id_usuario,
        fecha_reserva: fecha,
        hora_reserva: hora,
        numero_personas: personas
      });

      const id = res.data.reserva.reserva_id;

      // Después de reservar, llevo al usuario a elegir los platos
      navigate('/seleccionar-platos', {
        state: { reservaId: id }
      });

    } catch (error) {
      const msg = error.response?.data?.message || '❌ Error al crear la reserva';
      setMensaje(msg);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h4 className="mb-4 text-center">Hacer una reserva</h4>

            {mensaje && <div className="alert alert-warning">{mensaje}</div>}

            <form onSubmit={handleSubmit}>
              {/* Fecha de la reserva */}
              <div className="mb-3">
                <label className="form-label">Fecha:</label>
                <input
                  type="date"
                  className="form-control"
                  value={fecha}
                  min={obtenerFechaActual()}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              {/* Hora de la reserva */}
              <div className="mb-3">
                <label className="form-label">Hora:</label>
                <select
                  className="form-select"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                >
                  <option value="">-- Selecciona una hora --</option>
                  {horasDisponibles.length === 0 && (
                    <option disabled>No hay horas disponibles</option>
                  )}
                  {horasDisponibles.map((h, i) => (
                    <option key={i} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Número de personas */}
              <div className="mb-3">
                <label className="form-label">Número de personas:</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="20"
                  value={personas}
                  onChange={(e) => setPersonas(e.target.value)}
                  required
                />
              </div>

              {/* Cuántas mesas quedan */}
              {mesasDisponibles !== null && (
                <div className="alert alert-light border">
                  Mesas disponibles para el día seleccionado:{' '}
                  <strong>{mesasDisponibles}</strong>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100">
                Reservar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaForm;
