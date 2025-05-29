import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosCliente from './AxiosCliente';

const PedidoDomicilio = () => {
  const [platos, setPlatos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [direccion, setDireccion] = useState('');
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    axiosCliente.get('/platos')
      .then(res => setPlatos(res.data))
      .catch(err => console.error('Error cargando platos:', err));
  }, []);

  const togglePlato = (plato) => {
    const existe = seleccionados.find(p => p.plato_id === plato.id_plato);
    if (existe) {
      setSeleccionados(seleccionados.filter(p => p.plato_id !== plato.id_plato));
    } else {
      setSeleccionados([...seleccionados, {
        plato_id: plato.id_plato,
        cantidad: 1,
        precio: Number(plato.precio)
      }]);
    }
  };

  const cambiarCantidad = (plato_id, cantidad) => {
    setSeleccionados(prev =>
      prev.map(p =>
        p.plato_id === plato_id ? { ...p, cantidad: parseInt(cantidad) || 1 } : p
      )
    );
  };

  const calcularTotal = () => {
    return seleccionados.reduce((total, p) => total + p.precio * p.cantidad, 0);
  };

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
      setSeleccionados([]);
      setDireccion('');
      navigate('/');
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      setMensaje('❌ Error al enviar pedido');
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛵 Pedido a domicilio</h2>

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

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

                  {estaSeleccionado && (
                    <input
                      type="number"
                      min="1"
                      value={estaSeleccionado.cantidad}
                      onChange={(e) => cambiarCantidad(plato.id_plato, e.target.value)}
                      className="form-control mb-2"
                    />
                  )}

                  <button className="btn btn-primary" onClick={() => togglePlato(plato)}>
                    {estaSeleccionado ? 'Quitar' : 'Añadir'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
