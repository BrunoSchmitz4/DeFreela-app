import api from "./api";

// Versão MirageJS / API real (usando essa versão atualmente)

export async function getFreelancers(search = "") {
  const res = await api.get("/freelancers", {
    params: search ? { q: search } : {}
  });

  return res.data; // { data: [...] }
}

export async function getFreelancerById(id) {
  const res = await api.get(`/freelancers/${id}`);
  return res.data;
}

export async function getFreelancerJobs(id) {
  const res = await api.get(`/freelancers/${id}/jobs`);
  return res.data;
}

// Versão Mock (Atualmente desativado para fins de teste com o Mirage)

// import {
//   mockSearchFreelancers,
//   mockGetFreelancerProfile,
//   mockGetFreelancerJobs
// } from "../mocks/freelancers";

// export async function getFreelancers(search) {
//   return mockSearchFreelancers(search);
// }

// export async function getFreelancerById(id) {
//   return mockGetFreelancerProfile(id);
// }

// export async function getFreelancerJobs(id) {
//   return mockGetFreelancerJobs(id);
// }

