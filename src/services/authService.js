// Aqui será o import da API (vou usar um mockzin pra fins de testes)
import { mockLogin, mockGetProfile, mockLogout, mockRegister } from '../mocks/auth';


// Quando a API real existir, vou trocar por isso:

// import api from "./api";
// export function login(payload) { return api.post("/auth/login", payload) }
// export async function login(email, password) {
//   return api.post("/auth/login", { email, password });
// }

// export async function register(userData) {
//   return api.post("/auth/register", userData);
// }

// export async function logout() {
//   return api.post("/auth/logout");
// }

// export async function getProfile() {
//   return api.get("/auth/me"); // rota que valida usuário pelo JWT do cookie
// }

export async function login(email, password) {
  return await mockLogin(email, password);
}

export async function getProfile(token) {
  return await mockGetProfile(token);
}

export async function logout() {
  return await mockLogout();
}

export async function register(name, email, password) {
  return await mockRegister(name, email, password);
}