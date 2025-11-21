// src/pages/Projects/ProjectDetails/ActivitiesTab.jsx
import { useState, useEffect } from "react";
import { ActivityRepository } from "../../../repos/ActivityRepository";
import { TaskRepository } from "../../../repos/TaskRepository";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import styles from "./ProjectDetails.module.css";
import { LABELS_STATUS_TAREFA, CORES_STATUS_TAREFA } from "../../../utils/constants";

export default function ActivitiesTab({ projectId, activities, setActivities }) {
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityTasks, setActivityTasks] = useState({});
  const [expandedActivities, setExpandedActivities] = useState(new Set());

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    ordem: activities.length + 1
  });

  const [taskForm, setTaskForm] = useState({
    titulo: "",
    descricao: "",
    prioridade: "MEDIA",
    prazo: "",
    valor: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newActivity = await ActivityRepository.create(projectId, form);
      setActivities([...activities, newActivity]);
      setForm({ nome: "", descricao: "", ordem: activities.length + 2 });
      setShowModal(false);
      alert("Atividade criada com sucesso!");
    } catch (err) {
      console.error("Erro ao criar atividade:", err);
      alert("Erro ao criar atividade");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = await TaskRepository.create(selectedActivity.id, taskForm);
      
      // Atualiza lista de tarefas da atividade
      setActivityTasks({
        ...activityTasks,
        [selectedActivity.id]: [...(activityTasks[selectedActivity.id] || []), newTask]
      });

      setTaskForm({
        titulo: "",
        descricao: "",
        prioridade: "MEDIA",
        prazo: "",
        valor: ""
      });
      setShowTaskModal(false);
      alert("Tarefa criada com sucesso!");
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
      alert("Erro ao criar tarefa");
    }
  };

  const toggleActivity = async (activity) => {
    const isExpanded = expandedActivities.has(activity.id);

    if (isExpanded) {
      // Colapsa
      const newSet = new Set(expandedActivities);
      newSet.delete(activity.id);
      setExpandedActivities(newSet);
    } else {
      // Expande e carrega tarefas se ainda não carregou
      const newSet = new Set(expandedActivities);
      newSet.add(activity.id);
      setExpandedActivities(newSet);

      if (!activityTasks[activity.id]) {
        try {
          const tasks = await TaskRepository.getByActivity(activity.id);
          setActivityTasks({
            ...activityTasks,
            [activity.id]: tasks
          });
        } catch (err) {
          console.error("Erro ao carregar tarefas:", err);
        }
      }
    }
  };

  const openTaskModal = (activity) => {
    setSelectedActivity(activity);
    setShowTaskModal(true);
  };

  const sortedActivities = [...activities].sort((a, b) => a.ordem - b.ordem);

  // Calcula progresso de cada atividade
  const calculateActivityProgress = (activityId) => {
    const tasks = activityTasks[activityId] || [];
    if (tasks.length === 0) return 0;
    
    const completed = tasks.filter(t => t.status === 'CONCLUIDA').length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className={styles.activitiesTab}>
      <div className={styles.tabHeader}>
        <h2>Atividades do Projeto</h2>
        <Button onClick={() => setShowModal(true)}>+ Nova Atividade</Button>
      </div>

      {sortedActivities.length === 0 ? (
        <p className={styles.emptyState}>
          Nenhuma atividade criada ainda. Clique em "Nova Atividade" para começar.
        </p>
      ) : (
        <div className={styles.activitiesList}>
          {sortedActivities.map((activity) => {
            const isExpanded = expandedActivities.has(activity.id);
            const tasks = activityTasks[activity.id] || [];
            const progress = calculateActivityProgress(activity.id);

            return (
              <div key={activity.id} className={styles.activityCard}>
                {/* Header da Atividade */}
                <div 
                  className={styles.activityHeader}
                  onClick={() => toggleActivity(activity)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={styles.activityOrder}>#{activity.ordem}</span>
                  
                  <h3>{activity.nome}</h3>
                  
                  <div className={styles.activityMeta}>
                    <span className={styles.activityStatus}>
                      {activity.status}
                    </span>
                    
                    <span className={styles.activityTaskCount}>
                      {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
                    </span>

                    <span className={styles.expandIcon}>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {/* Descrição */}
                <p className={styles.activityDesc}>{activity.descricao}</p>

                {/* Barra de Progresso */}
                {tasks.length > 0 && (
                  <div className={styles.activityProgress}>
                    <div className={styles.progressLabel}>
                      <span>Progresso</span>
                      <span>{progress}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tarefas (quando expandido) */}
                {isExpanded && (
                  <div className={styles.activityTasksSection}>
                    <div className={styles.tasksSectionHeader}>
                      <h4>Tarefas desta Atividade</h4>
                      <Button 
                        variant="secondary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openTaskModal(activity);
                        }}
                      >
                        + Adicionar Tarefa
                      </Button>
                    </div>

                    {tasks.length === 0 ? (
                      <p className={styles.noTasks}>
                        Nenhuma tarefa criada para esta atividade.
                      </p>
                    ) : (
                      <div className={styles.tasksMiniList}>
                        {tasks.map(task => {
                          const statusLabel = LABELS_STATUS_TAREFA[task.status] || task.status;
                          const statusColor = CORES_STATUS_TAREFA[task.status] || '#6b7280';

                          return (
                            <div key={task.id} className={styles.taskMiniCard}>
                              <div className={styles.taskMiniHeader}>
                                <span className={styles.taskMiniTitle}>{task.titulo}</span>
                                <span
                                  className={styles.taskMiniStatus}
                                  style={{
                                    backgroundColor: `${statusColor}15`,
                                    color: statusColor,
                                    border: `1px solid ${statusColor}30`
                                  }}
                                >
                                  {statusLabel}
                                </span>
                              </div>
                              <p className={styles.taskMiniDesc}>{task.descricao}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação de Atividade */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Atividade">
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <Input
              label="Nome da Atividade"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Pesquisa e Planejamento"
              required
            />

            <label>Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o objetivo desta atividade..."
              className={styles.textarea}
              required
            />

            <Input
              label="Ordem"
              name="ordem"
              type="number"
              value={form.ordem}
              onChange={handleChange}
              required
            />

            <div className={styles.modalActions}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Atividade</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de Criação de Tarefa */}
      {showTaskModal && selectedActivity && (
        <Modal 
          isOpen={showTaskModal} 
          onClose={() => setShowTaskModal(false)} 
          title={`Nova Tarefa - ${selectedActivity.nome}`}
        >
          <form onSubmit={handleCreateTask} className={styles.modalForm}>
            <Input
              label="Título da Tarefa"
              name="titulo"
              value={taskForm.titulo}
              onChange={handleTaskChange}
              placeholder="Ex: Criar wireframes desktop"
              required
            />

            <label>Descrição</label>
            <textarea
              name="descricao"
              value={taskForm.descricao}
              onChange={handleTaskChange}
              placeholder="Descreva a tarefa em detalhes..."
              className={styles.textarea}
              required
            />

            <label>Prioridade</label>
            <select 
              name="prioridade"
              value={taskForm.prioridade}
              onChange={handleTaskChange}
              className={styles.select}
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
              <option value="URGENTE">Urgente</option>
            </select>

            <Input
              label="Prazo"
              name="prazo"
              type="date"
              value={taskForm.prazo}
              onChange={handleTaskChange}
              required
            />

            <Input
              label="Valor (R$)"
              name="valor"
              type="number"
              step="0.01"
              value={taskForm.valor}
              onChange={handleTaskChange}
              placeholder="Ex: 1500.00"
              required
            />

            <div className={styles.modalActions}>
              <Button type="button" variant="secondary" onClick={() => setShowTaskModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Tarefa</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}