import api from "./api";

/**
 * UC07 - Atualizar perfil do usuário
 * @param {number} userId 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function updateUserProfile(userId, payload) {
  const res = await api.patch(`/users/${userId}`, payload);
  return res.data; // { data: user }
}

/**
 * UC07 - Buscar usuário por ID
 * @param {number} userId 
 * @returns {Promise}
 */
export async function getUserById(userId) {
  const res = await api.get(`/users/${userId}`);
  return res.data; // { data: user }
}