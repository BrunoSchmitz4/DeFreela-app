// Aqui configuramos a instância do axios para fazer as requisições HTTP

// O Axios é uma biblioteca para fazer requisições HTTP, similar ao fetch, mas com mais funcionalidades e uma sintaxe mais simples.
// Documentação: https://axios-http.com/docs/intro

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // futuramente API
  withCredentials: true, // Para uso de cookies (HTTPOnly)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
