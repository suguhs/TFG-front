import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosCliente from './AxiosCliente';


function Menu() {
  const user = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const [platos, setPlatos] = useState([]);
  const [nuevoPlato, setNuevoPlato] = useState({
    nombre_plato: '',
    descripcion: '',
    precio: ''
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editarPlato, setEditarPlato] = useState(null);

  // Cargar todos los platos
  useEffect(() => {
    axiosCliente.get('/platos')
      .then(res => setPlatos(res.data))
      .catch(err => console.error('Error al cargar platos:', err));
  }, []);

  // Cambios en los campos del formulario
  const handleChange = (e) => {
    setNuevoPlato({
      ...nuevoPlato,
      [e.target.name]: e.target.value
    });
  };

  // Enviar nuevo plato o editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editarPlato ? `/platos/${editarPlato.id_plato}` : '/platos';
    const metodo = editarPlato ? 'put' : 'post';

    try {
      const res = await axiosCliente[metodo](url, nuevoPlato);

      if (editarPlato) {
        setPlatos(platos.map(plato =>
          plato.id_plato === editarPlato.id_plato ? res.data : plato
        ));
      } else {
        setPlatos([...platos, res.data]);
      }

      setNuevoPlato({ nombre_plato: '', descripcion: '', precio: '' });
      setMostrarFormulario(false);
      setEditarPlato(null);
    } catch (err) {
      console.error('Error al guardar el plato:', err);
      alert('❌ No se pudo guardar el plato.');
    }
  };

  // Eliminar plato
  const eliminarPlato = (idPlato) => {
    axiosCliente.delete(`/platos/${idPlato}`)
      .then(() => {
        setPlatos(platos.filter(plato => plato.id_plato !== idPlato));
      })
      .catch(err => {
        console.error('Error al eliminar plato:', err);
        alert('❌ No se pudo eliminar el plato.');
      });
  };

  // Manejar pedido a domicilio
  const manejarPedido = () => {
    if (!user) {
      alert('Debes iniciar sesión para hacer un pedido.');
      navigate('/login');
    } else {
      navigate('/pedido-domicilio');
    }
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center text-center">
      <h2>🍽️ Menú</h2>
      <div className="d-flex justify-content-center w-100 mb-3">
        <button className="btn btn-primary" onClick={manejarPedido}>
          🛒 Hacer pedido a domicilio
        </button>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
        {platos.map(plato => (
          <div key={plato.id_plato} className="border rounded p-3" style={{ width: '250px', textAlign: 'center' }}>
            <h4>{plato.nombre_plato}</h4>
            <p>{plato.descripcion}</p>
            <p><strong>{plato.precio} €</strong></p>
            {user?.rol === 'admin' && (
              <div>
                <button className="btn btn-warning m-2" onClick={() => {
                  setEditarPlato(plato);
                  setNuevoPlato({
                    nombre_plato: plato.nombre_plato,
                    descripcion: plato.descripcion,
                    precio: plato.precio
                  });
                  setMostrarFormulario(true);
                }}>
                  Editar
                </button>
                <button className="btn btn-danger m-2" onClick={() => eliminarPlato(plato.id_plato)}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {user?.rol === 'admin' && (
        <div className="text-start w-100" style={{ maxWidth: '400px' }}>
          <button
            onClick={() => {
              setEditarPlato(null);
              setMostrarFormulario(!mostrarFormulario);
              setNuevoPlato({ nombre_plato: '', descripcion: '', precio: '' });
            }}
            className="btn btn-link text-decoration-none text-purple mb-3"
          >
            <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>➕</span>
            {editarPlato ? 'Editar plato' : 'Añadir nuevo plato'}
          </button>

          {mostrarFormulario && (
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <input
                type="text"
                name="nombre_plato"
                className="form-control"
                placeholder="Nombre del plato"
                value={nuevoPlato.nombre_plato}
                onChange={handleChange}
                required
              />
              <textarea
                name="descripcion"
                className="form-control"
                placeholder="Descripción"
                value={nuevoPlato.descripcion}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                step="0.01"
                name="precio"
                className="form-control"
                placeholder="Precio"
                value={nuevoPlato.precio}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn btn-success">{editarPlato ? 'Actualizar' : 'Guardar'}</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Menu;
