// USER
export const UserType = {
  id: "",
  name: "",
  email: "",
  role: "client", // "client" | "freelancer"
  avatarUrl: "",
  createdAt: "",
};

// PROJECT
export const ProjectType = {
  id: "",
  title: "",
  description: "",
  budget: 0,
  category: "",
  status: "ativo", // "ativo" | "cancelado" | "concluido"
  clientId: "",
  createdAt: "",
  updatedAt: "",
};

// FREELANCER
export const FreelancerType = {
  id: "",
  name: "",
  email: "",
  skills: [],
  rating: 0,
  avatarUrl: "",
  hourlyRate: 0,
  createdAt: "",
};

// CONTRACT / INTERESSE
export const ContractType = {
  id: "",
  projectId: "",
  freelancerId: "",
  status: "interesse", // "interesse" | "aceito" | "cancelado"
  createdAt: "",
};

// HELPERS
export function createInitial(type) {
  // Cria deep-copy simples para evitar mutações acidentais
  return JSON.parse(JSON.stringify(type));
}
