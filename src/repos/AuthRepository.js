import * as AuthService from "../services/authService";

export const AuthRepository = {
  async login(email, password) {
    const res = await AuthService.login(email, password);
    return {
      user: res.data,
      token: res.token,
    };
  },

  async register(name, email, password) {
    const res = await AuthService.register(name, email, password);
    return {
      user: res.data,
      token: res.token,
    };
  },

  async getProfile() {
    const res = await AuthService.getProfile();
    return { user: res.data };
  },

  async logout() {
    return await AuthService.logout();
  },
};