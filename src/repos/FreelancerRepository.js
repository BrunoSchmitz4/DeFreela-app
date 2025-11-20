import * as FreelancerService from "../services/freelancerService";

export const FreelancerRepository = {
  async search(query = "") {
    const res = await FreelancerService.getFreelancers(query);
    return res.data; // lista pura de freelancers
  },

  async getById(id) {
    const res = await FreelancerService.getFreelancerById(id);
    return res.data;
  },

  async getJobs(id) {
    const res = await FreelancerService.getFreelancerJobs(id);
    return res.data; // lista pura de projetos
  }
};