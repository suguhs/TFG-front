import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-4 py-3">
      <div className="container">
        <div className="row text-center text-md-start">

          {/* Parte izquierda: descripción del restaurante */}
          <div className="col-md-4 mb-3">
            <h5 className="text-white">El Tapeo de Dami</h5>
            <p className="text-white">
              Tu restaurante de confianza. Reserva, pide y disfruta desde casa.
            </p>
          </div>

          {/* Parte central: enlaces rápidos a las páginas */}
          <div className="col-md-4 mb-3">
            <h5 className="text-white">Enlaces útiles</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Inicio</Link></li>
              <li><Link to="/menu" className="text-white text-decoration-none">Menú</Link></li>
              <li><Link to="/reserva" className="text-white text-decoration-none">Reserva</Link></li>
              <li><Link to="/comentarios" className="text-white text-decoration-none">Comentarios</Link></li>
            </ul>
          </div>

          {/* Parte derecha: datos de contacto y redes sociales */}
          <div className="col-md-4 mb-3">
            <h5 className="text-white">Contacto</h5>
            <p className="text-white mb-1">
              <i className="bi bi-envelope-fill me-2"></i> eltapeodedami@gmail.com
            </p>
            <p className="text-white mb-1">
              <i className="bi bi-phone-fill me-2"></i> +34 984 83 01 21
            </p>
            <div className="mt-2">
              {/* Enlaces de redes (ahora están vacíos) */}
              <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>

        </div>

        {/* Línea divisoria */}
        <hr className="border-secondary" />

        {/* Pie del footer con el año actual y derechos */}
        <div className="text-center text-white">
          &copy; {new Date().getFullYear()} El Tapeo de Dami, Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;
