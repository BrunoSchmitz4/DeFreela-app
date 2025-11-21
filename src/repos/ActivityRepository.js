import * as ActivityService from "../services/activityService";

export const ActivityRepository = {
  async getByProject(projectId) {
    const res = await ActivityService.getActivitiesByProject(projectId);
    return res.data; // array puro
  },

  async create(projectId, payload) {
    const res = await ActivityService.createActivity(projectId, payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await ActivityService.updateActivity(id, payload);
    return res.data;
  },

  async delete(id) {
    return await ActivityService.deleteActivity(id);
  },

  async reorder(id, novaOrdem) {
    const res = await ActivityService.reorderActivity(id, novaOrdem);
    return res.data;
  }
};