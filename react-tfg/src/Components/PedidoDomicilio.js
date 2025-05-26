import React, { useEffect, useState } from 'react';
import axiosCliente from './AxiosCliente';

const PedidoDomicilio = () => {
  const [platos, setPlatos] = useState([]); // aquí guardamos todos los platos del menú
  const [seleccionados, setSeleccionados] = useState([]); // aquí los que el cliente va eligiendo
  const [mensaje, setMensaje] = useState('');
  const [direccion, setDireccion] = useState('');

  const usuario = JSON.parse(localStorage.getItem('usuario')); // sacamos al usuario del localStorage

  // Al cargar la página, pedimos los platos al backend
  useEffect(() => {
    axiosCliente.get('/platos')
      .then(res => setPlatos(res.data))
      .catch(err => console.error('Error cargando platos:', err));
  }, []);

  // Esta función añade o quita un plato del pedido
  const togglePlato = (plato) => {
    const existe = seleccionados.find(p => p.plato_id === plato.id_plato);
    if (existe) {
      // Si ya estaba, lo quitamos
      setSeleccionados(seleccionados.filter(p => p.plato_id !== plato.id_plato));
    } else {
      // Si no estaba, lo añadimos con cantidad 1
      setSeleccionados([...seleccionados, {
        plato_id: plato.id_plato,
        cantidad: 1,
        precio: Number(plato.precio)
      }]);
    }
  };

  // Cambiamos la cantidad de un plato ya seleccionado
  const cambiarCantidad = (plato_id, cantidad) => {
    setSeleccionados(prev =>
      prev.map(p =>
        p.plato_id === plato_id ? { ...p, cantidad: parseInt(cantidad) || 1 } : p
      )
    );
  };

  // Calculamos el total del pedido sumando (precio * cantidad) de cada plato
  const calcularTotal = () => {
    return seleccionados.reduce((total, p) => total + p.precio * p.cantidad, 0);
  };

  // Enviamos el pedido al backend
  const enviarPedido = async () => {
    if (!direccion.trim()) {
      setMensaje('❌ Debes indicar una dirección');
      return;
    }

    try {
      await axiosCliente.post('/pedidos', {
        id_usuario: usuario.id_usuario,
        direccion,
        platos: seleccionados
      });

      setMensaje('✅ Pedido enviado correctamente');
      setSeleccionados([]); // vaciamos el pedido
      setDireccion('');     // y también la dirección
    } catch (err) {
      setMensaje('❌ Error al enviar pedido');
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛵 Pedido a domicilio</h2>

      {/* Mensaje de error o éxito */}
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {/* Campo para escribir la dirección del envío */}
      <div className="mb-3">
        <label className="form-label">Dirección de entrega</label>
        <input
          type="text"
          className="form-control"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          placeholder="Calle, número, piso..."
        />
      </div>

      {/* Listado de platos del menú */}
      <div className="row">
        {platos.map(plato => {
          const estaSeleccionado = seleccionados.find(p => p.plato_id === plato.id_plato);
          return (
            <div className="col-md-4 mb-3" key={plato.id_plato}>
              <div className={`card ${estaSeleccionado ? 'border-success' : ''}`}>
                <div className="card-body">
                  <h5>{plato.nombre_plato}</h5>
                  <p>{plato.descripcion}</p>
                  <p><strong>{Number(plato.precio).toFixed(2)} €</strong></p>

                  {/* Si el plato ya está en el pedido, mostramos el input para cantidad */}
                  {estaSeleccionado && (
                    <input
                      type="number"
                      min="1"
                      value={estaSeleccionado.cantidad}
                      onChange={(e) => cambiarCantidad(plato.id_plato, e.target.value)}
                      className="form-control mb-2"
                    />
                  )}

                  {/* Botón para añadir o quitar el plato */}
                  <button className="btn btn-primary" onClick={() => togglePlato(plato)}>
                    {estaSeleccionado ? 'Quitar' : 'Añadir'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Si hay platos seleccionados, mostramos el total y el botón para confirmar */}
      {seleccionados.length > 0 && (
        <>
          <div className="mt-3">
            <h5>Total: {calcularTotal().toFixed(2)} €</h5>
          </div>
          <button className="btn btn-success mt-2" onClick={enviarPedido}>Confirmar pedido</button>
        </>
      )}
    </div>
  );
};

export default PedidoDomicilio;
