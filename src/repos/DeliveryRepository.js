import * as DeliveryService from "../services/deliveryService";

export const DeliveryRepository = {
  /**
   * Lista entregas de uma tarefa
   * @param {number} taskId 
   * @returns {Promise}
   */
  async getByTask(taskId) {
    const res = await DeliveryService.getDeliveriesByTask(taskId);
    return res.data; // array puro
  },

  /**
   * Busca entrega por ID
   * @param {number} id 
   * @returns {Promise}
   */
  async getById(id) {
    const res = await DeliveryService.getDeliveryById(id);
    return res.data;
  },

  /**
   * Cria nova entrega
   * @param {number} taskId 
   * @param {object} payload - { arquivo_url, observacoes }
   * @returns {Promise}
   */
  async create(taskId, payload) {
    const res = await DeliveryService.createDelivery(taskId, payload);
    return res.data;
  },

  /**
   * Aprova entrega
   * @param {number} id 
   * @param {number} aprovadorId 
   * @returns {Promise}
   */
  async approve(id, aprovadorId) {
    const res = await DeliveryService.approveDelivery(id, aprovadorId);
    return res.data;
  },

  /**
   * Reprova entrega
   * @param {number} id 
   * @param {string} motivo 
   * @returns {Promise}
   */
  async reject(id, motivo) {
    const res = await DeliveryService.rejectDelivery(id, motivo);
    return res.data;
  },

  /**
   * Solicita revisão
   * @param {number} id 
   * @param {string} feedback 
   * @returns {Promise}
   */
  async requestRevision(id, feedback) {
    const res = await DeliveryService.requestRevision(id, feedback);
    return res.data;
  },

  /**
   * Busca entregas do freelancer
   * @param {number} freelancerId 
   * @returns {Promise}
   */
  async getByFreelancer(freelancerId) {
    const res = await DeliveryService.getDeliveriesByFreelancer(freelancerId);
    return res.data;
  },

  /**
   * Busca entregas por status
   * @param {string} status 
   * @returns {Promise}
   */
  async getByStatus(status) {
    const res = await DeliveryService.getDeliveriesByStatus(status);
    return res.data;
  },

  /**
   * Busca entregas pendentes de aprovação
   * @returns {Promise}
   */
  async getPendingApproval() {
    return await this.getByStatus('AGUARDANDO_APROVACAO');
  }
};