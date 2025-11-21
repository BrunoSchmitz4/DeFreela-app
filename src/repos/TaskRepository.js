import * as TaskService from "../services/taskService"

export const TaskRepository = {
  /**
   * UC - Listar tarefas de uma atividade
   */
  async getByActivity(activityId) {
    const res = await TaskService.getTasksByActivity(activityId);
    return res.data; // array puro
  },

  /**
   * UC - Buscar tarefa por ID
   */
  async getById(id) {
    const res = await TaskService.getTaskById(id);
    return res.data;
  },

  /**
   * UC - Criar nova tarefa
   */
  async create(activityId, payload) {
    const res = await TaskService.createTask(activityId, payload);
    return res.data;
  },

  /**
   * UC - Atualizar tarefa
   */
  async update(id, payload) {
    const res = await TaskService.updateTask(id, payload);
    return res.data;
  },

  /**
   * UC - Deletar tarefa
   */
  async delete(id) {
    return await TaskService.deleteTask(id);
  },

  /**
   * UC - Atribuir freelancer a tarefa
   */
  async assignFreelancer(taskId, freelancerId) {
    const res = await TaskService.assignFreelancer(taskId, freelancerId);
    return res.data;
  },

  /**
   * UC - Mudar status da tarefa
   */
  async changeStatus(taskId, newStatus) {
    const res = await TaskService.changeTaskStatus(taskId, newStatus);
    return res.data;
  },

  /**
   * UC - Buscar tarefas do freelancer (todos os projetos)
   */
  async getByFreelancer(freelancerId) {
    const res = await TaskService.getTasksByFreelancer(freelancerId);
    return res.data;
  },

  /**
   * UC - Buscar tarefas por status
   */
  async getByStatus(status) {
    const res = await TaskService.getTasksByStatus(status);
    return res.data;
  },

  /**
   * UC - Buscar tarefas atrasadas
   */
  async getOverdue() {
    const res = await TaskService.getOverdueTasks();
    return res.data;
  },

  /**
   * UC - Marcar tarefa como concluída
   */
  async markAsCompleted(taskId) {
    return await this.changeStatus(taskId, 'CONCLUIDA');
  },

  /**
   * UC - Cancelar tarefa
   */
  async cancel(taskId, motivo) {
    const res = await TaskService.updateTask(taskId, {
      status: 'CANCELADA',
      observacoes: motivo
    });
    return res.data;
  }
};