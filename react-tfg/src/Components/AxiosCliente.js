import axios from 'axios';

const axiosCliente = axios.create({
  baseURL: 'https://tfg-bacl-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

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
