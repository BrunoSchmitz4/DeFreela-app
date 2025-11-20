import api from "./api";
// import { mockLogin, mockGetProfile, mockLogout, mockRegister } from "../mocks/auth";

// Versão MirageJS / API real (usando essa versão atualmente)

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { data, token }
}

export async function register(name, email, password) {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data; // { data, token }
}

export async function getProfile() {
  const res = await api.get("/auth/me"); // interceptor adiciona Authorization
  return res.data; // { data }
}

export async function logout() {
  const res = await api.post("/auth/logout"); // interceptor adiciona Authorization
  return res.data;
}

// Versão Mock (Atualmente desativado para fins de teste com o Mirage)


// export async function login(email, password) {
//   return await mockLogin(email, password);
// }

// export async function register(name, email, password) {
//   return await mockRegister(name, email, password);
// }

// export async function getProfile(token) {
//   return await mockGetProfile(token);
// }

// export async function logout() {
//   return await mockLogout();
// }

