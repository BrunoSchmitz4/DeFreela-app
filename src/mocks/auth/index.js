import user from "./user.json";

// Simula tempo de requisição (para loading ficar real)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// MOCK — Banco de dados interno
const mockUser = user;

// Simula um "token"
const fakeToken = "123abcTOKEN";

export async function mockLogin(email, password) {
  await delay(800);

  // "email": "john@example.com",
  if (email !== mockUser.email || password !== "123456") {
    throw new Error("Credenciais inválidas.");
  }

  return {
    user: mockUser,
    token: fakeToken
  };
}

export async function mockGetProfile(token) {
  await delay(500);

  if (token !== fakeToken) {
    throw new Error("Token inválido ou expirado.");
  }

  return mockUser;
}

export async function mockLogout() {
  await delay(300);
  return true;
}
