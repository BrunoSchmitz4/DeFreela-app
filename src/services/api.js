// Aqui configuramos a instância do axios para fazer as requisições HTTP

// O Axios é uma biblioteca para fazer requisições HTTP, similar ao fetch, mas com mais funcionalidades e uma sintaxe mais simples.
// Documentação: https://axios-http.com/docs/intro

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // nada
  }
  return config;
});

export default api;