// src/hooks/useFreelancers.js
import { useState } from "react";
import { freelancerService } from "../services/freelancerService";

export function useFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchFreelancers(query) {
    setLoading(true);
    const data = await freelancerService.search(query);
    setFreelancers(data);
    setLoading(false);
  }

  async function getFreelancerProfile(id) {
    return await freelancerService.getProfile(id);
  }

  return { freelancers, loading, searchFreelancers, getFreelancerProfile };
}
