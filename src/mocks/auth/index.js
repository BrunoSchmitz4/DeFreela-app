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

  if (email !== mockUser.email || password !== "123456") {
    throw new Error("Credenciais inválidas.");
  }

  return {
    data: mockUser,
    token: fakeToken
  };
}

export async function mockGetProfile(token) {
  await delay(500);

  if (token !== fakeToken) {
    throw new Error("Token inválido ou expirado.");
  }

  return {
    data: mockUser
  };
}


export async function mockLogout() {
  await delay(300);
  return true;
}

// MOCK: registro de usuário
export async function mockRegister(name, email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // exemplo básico: email repetido
      if (email === "user@email.com") {
        return reject({ message: "Email já cadastrado!" });
      }

      // sucesso
      resolve({
        message: "Usuário registrado com sucesso!",
        user: {
          id: Date.now(),
          name,
          email
        }
      });
    }, 700);
  });
}
