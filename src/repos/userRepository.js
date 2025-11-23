import * as UserService from "../services/userService";

export const UserRepository = {
  /**
   * UC07 - Atualizar perfil
   */
  async updateProfile(userId, data) {
    const res = await UserService.updateUserProfile(userId, data);
    return res.data;
  },

  /**
   * UC07 - Buscar por ID
   */
  async getById(userId) {
    const res = await UserService.getUserById(userId);
    return res.data;
  }
};