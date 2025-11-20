export const contractService = {
  async markInterest(projectId, freelancerId) {
    return Promise.resolve({ projectId, freelancerId, interested: true });
  },

  async unmarkInterest(projectId, freelancerId) {
    return Promise.resolve({ projectId, freelancerId, interested: false });
  },

  async cancelContract(projectId, freelancerId) {
    return Promise.resolve({ projectId, freelancerId, status: 'cancelado' });
  },
};
