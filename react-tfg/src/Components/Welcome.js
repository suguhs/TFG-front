import React from 'react';
import logoBar from '../assets/logo_bar.png'; // Asegúrate de tener este archivo

const Welcome = () => {
  return (
    <div className="container my-5">

      {/* 🟢 Título principal */}
      <div className="mb-5 text-center">
        <h1 className="mb-3">Bienvenido a El Tapeo de Dami</h1>
        <p className="fs-5 text-muted">
          En nuestro bar encontrarás el mejor ambiente familiar, tapas de calidad y un servicio cercano.
          Ya sea para una comida rápida o una cena entre amigos, aquí siempre eres bienvenido.
        </p>
      </div>

      {/* 🍽️ Especialidades + Imagen */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h3 className="mb-3">Nuestras especialidades</h3>
          <p className="fs-6">
            Prueba nuestras tapas caseras, nuestras raciones para compartir y nuestros postres artesanos.
            Todo preparado con ingredientes frescos y mucho cariño. Ideal para disfrutar cualquier día de la semana.
          </p>
        </div>
        <div className="col-md-6 text-center">
          <img
            src={logoBar}
            alt="Especialidad del bar"
            className="img-fluid rounded shadow"
            style={{ maxHeight: '280px', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* 📍 Ubicación + Mapa */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6 mb-3 mb-md-0">
          <h4 className="mb-2">¿Dónde estamos?</h4>
          <p className="fs-6 text-muted">
            Nos encontramos en el corazón del barrio, cerca de ti. Puedes venir a tapear o pedir para llevar.
            ¡Te esperamos con los brazos abiertos!
          </p>
        </div>
        <div className="col-md-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5781.070286743552!2d-5.943044888554806!3d43.57456855739298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd369c8a03821d0f%3A0xca4daef40a7cbc6e!2sEl%20Tapeo%20de%20Dami!5e0!3m2!1ses!2ses!4v1748095954245!5m2!1ses!2ses"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded shadow"
        />

        </div>
      </div>

    </div>
  );
};

export default Welcome;
