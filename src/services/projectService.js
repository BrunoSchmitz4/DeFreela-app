// src/services/projectService.js
import api from './api'; // futura integração real
import mockProjects from '../mocks/projects';

// Obs: Eu preciso trocar as Promise.resolve() por chamadas à própria API quando ela estiver prontas (tipo api.get/)
export const projectService = {
  async getAll() {
    // Simula GET /projects
    return Promise.resolve(mockProjects);
  },

  async create(projectData) {
    // Simula POST /projects
    const newProject = { id: Date.now(), status: 'ativo', ...projectData };
    return Promise.resolve(newProject);
  },

  async update(id, data) {
    // Simula PUT /projects/:id
    return Promise.resolve({ id, ...data });
  },

  async cancel(id) {
    // Simula PATCH /projects/:id/cancel
    return Promise.resolve({ id, status: 'cancelado' });
  },

  async remove(id) {
    // Simula DELETE /projects/:id
    return Promise.resolve({ success: true, id });
  },
};
