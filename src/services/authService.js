import api from './api'
// Aqui será o import da API (vou usar um mockzin pra fins de testes)


export async function login(email, password) {
  return api.post("/auth/login", { email, password });
}

export async function register(userData) {
  return api.post("/auth/register", userData);
}

export async function logout() {
  return api.post("/auth/logout");
}

export async function getProfile() {
  return api.get("/auth/me"); // rota que valida usuário pelo JWT do cookie
}