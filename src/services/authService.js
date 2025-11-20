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

// login retorna { data, token }
export async function login(email, password) {
  return await mockLogin(email, password);
}

// getProfile retorna { data }
export async function getProfile(token) {
  return await mockGetProfile(token);
}

// logout aceita token opcional
export async function logout(token) {
  return await mockLogout(token);
}

// register retorna { data, token }
export async function register(name, email, password) {
  return await mockRegister(name, email, password);
}