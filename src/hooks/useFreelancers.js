import { useState } from "react";
import { FreelancerRepository } from "../repos/FreelancerRepository";

export function useFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchFreelancers(query) {
    setLoading(true);
    const data = await FreelancerRepository.search(query);
    setFreelancers(data);
    setLoading(false);
  }

  async function getFreelancerProfile(id) {
    return await FreelancerRepository.getById(id);
  }

  return { freelancers, loading, searchFreelancers, getFreelancerProfile };
}
