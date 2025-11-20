import api from "./api";

// Versão MirageJS / API real (usando essa versão atualmente)

export async function getAllProjects(search = "") {
  const res = await api.get("/projects", {
    params: search ? { q: search } : {}
  });
  return res.data; // { data: [...] }
}

export async function getProjectById(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}

export async function createProject(payload) {
  const res = await api.post("/projects", payload);
  return res.data;
}

export async function updateProject(id, payload) {
  const res = await api.patch(`/projects/${id}`, payload);
  return res.data;
}

export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
}

export async function expressInterest(projectId, freelancerId) {
  const res = await api.post(`/projects/${projectId}/interest`, {
    freelancerId
  });
  return res.data;
}

export async function cancelInterest(projectId, freelancerId) {
  const res = await api.delete(
    `/projects/${projectId}/interest/${freelancerId}`
  );
  return res.data;
}

// Versão Mock (Atualmente desativado para fins de teste com o Mirage)

// import {
//   mockCreateProject,
//   mockUpdateProject,
//   mockGetAllProjects,
//   mockGetProjectById,
//   mockDeleteProject,
//   mockExpressInterest,
//   mockCancelInterest
// } from "../mocks/projects";

// export async function getAllProjects(search) {
//   return mockGetAllProjects(search);
// }

// export async function getProjectById(id) {
//   return mockGetProjectById(id);
// }

// export async function createProject(payload) {
//   return mockCreateProject(payload);
// }

// export async function updateProject(id, payload) {
//   return mockUpdateProject(id, payload);
// }

// export async function deleteProject(id) {
//   return mockDeleteProject(id);
// }

// export async function expressInterest(projectId, freelancerId) {
//   return mockExpressInterest(projectId, freelancerId);
// }

// export async function cancelInterest(projectId, freelancerId) {
//   return mockCancelInterest(projectId, freelancerId);
// }

