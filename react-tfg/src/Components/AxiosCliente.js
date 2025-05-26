
import axios from 'axios';

const axiosCliente = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

// Interceptor para añadir el token automáticamente
axiosCliente.interceptors.request.use(config => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario?.token) {
    config.headers.Authorization = `Bearer ${usuario.token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosCliente;
