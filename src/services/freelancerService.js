import mockFreelancers from '../mocks/freelancers';

export const freelancerService = {
  async search(query) {
    // Simula GET /freelancers?query=
    return Promise.resolve(
      mockFreelancers.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  },

  async getProfile(id) {
    // Simula GET /freelancers/:id
    return Promise.resolve(mockFreelancers.find(f => f.id === id));
  },
};
