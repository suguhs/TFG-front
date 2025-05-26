import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './Components/RegisterForm';
import LoginForm from './Components/LoginForm';
import Welcome from './Components/Welcome';
import Comentarios from './Components/Comentarios';
import Navbar from './Components/Navbar';
import ReservaForm from './Components/ReservaForm';
import SeleccionPlatos from './Components/SeleccionPlatos';
import Historial from './Components/Historial';
import Menu from './Components/Menu';
import Footer from './Components/Footer';
import PedidoDomicilio from './Components/PedidoDomicilio';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/registro" element={<RegisterForm />} />
            <Route path="/comentarios" element={<Comentarios />} />
            <Route path="/reserva" element={<ReservaForm />} />
            <Route path="/seleccionar-platos" element={<SeleccionPlatos />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/pedido-domicilio" element={<PedidoDomicilio />} />

          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
