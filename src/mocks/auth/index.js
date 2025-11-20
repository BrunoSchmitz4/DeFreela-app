import user from "./user.json";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockUser = user;
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
    data: mockUser,
    token: fakeToken
  };
}

export async function mockLogout() {
  await delay(300);
  return true;
}

export async function mockRegister(name, email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "user@email.com") {
        return reject({ message: "Email já cadastrado!" });
      }

      resolve({
        data: {
          id: Date.now(),
          name,
          email
        },
        token: fakeToken
      });
    }, 700);
  });
}
