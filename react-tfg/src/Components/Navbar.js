import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo_bar from '../assets/logo_bar.png';

const Navbar = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 shadow position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo + usuario (cuando hay hamburguesa) */}
        <div className="d-flex align-items-center gap-2">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo_bar} alt="El Tapeo de Dami" height="90" />
          </Link>

          {/* Mostrar usuario al lado del logo si hay sesión iniciada */}
          {usuario && (
            <div className="d-lg-none position-relative z-3">
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {usuario.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end position-absolute">
                  <li>
                    <Link className="dropdown-item" to="/historial">Ver historial</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={cerrarSesion}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Botón hamburguesa (visible en móviles) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú normal colapsable */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/comentarios">Comentarios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/menu">Menú</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/reserva">Reserva</Link>
            </li>

            {/* Usuario en escritorio */}
            {usuario ? (
              <li className="nav-item dropdown d-none d-lg-block position-relative z-3">
                <button
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {usuario.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end position-absolute">
                  <li>
                    <Link className="dropdown-item" to="/historial">Ver historial</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={cerrarSesion}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li>
                  <Link className="btn btn-outline-light" to="/login">Iniciar sesión</Link>
                </li>
                <li>
                  <Link className="btn btn-light" to="/registro">Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
