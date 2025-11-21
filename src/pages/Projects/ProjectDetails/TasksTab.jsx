// src/pages/Projects/ProjectDetails/TasksTab.jsx
import { useEffect, useState } from "react";
import { TaskRepository } from "../../../repos/TaskRepository";
import { 
  LABELS_STATUS_TAREFA, 
  CORES_STATUS_TAREFA,
  LABELS_PRIORIDADE,
  CORES_PRIORIDADE 
} from "../../../utils/constants";
import { formatDate, formatCurrency, isOverdue, isDeadlineNear } from "../../../utils/formatters";
import styles from "./ProjectDetails.module.css";

export default function TasksTab({ projectId, activities }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        // Busca tarefas de todas as atividades
        const allTasks = [];
        for (const activity of activities) {
          const activityTasks = await TaskRepository.getByActivity(activity.id);
          
          // Adiciona nome da atividade em cada tarefa
          const tasksWithActivity = activityTasks.map(task => ({
            ...task,
            atividade_nome: activity.nome
          }));
          
          allTasks.push(...tasksWithActivity);
        }
        setTasks(allTasks);
      } catch (err) {
        console.error("Erro ao carregar tarefas:", err);
      } finally {
        setLoading(false);
      }
    }

    if (activities.length > 0) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [activities]);

  // Filtros
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const priorityMatch = filterPriority === "all" || task.prioridade === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Estatísticas
  const stats = {
    total: tasks.length,
    pendentes: tasks.filter(t => t.status === 'PENDENTE').length,
    emProgresso: tasks.filter(t => t.status === 'EM_PROGRESSO').length,
    concluidas: tasks.filter(t => t.status === 'CONCLUIDA').length,
    atrasadas: tasks.filter(t => isOverdue(t.prazo)).length
  };

  if (loading) {
    return <p>Carregando tarefas...</p>;
  }

  if (tasks.length === 0) {
    return (
      <p className={styles.emptyState}>
        Nenhuma tarefa criada ainda. Vá para a aba "Atividades" e adicione tarefas.
      </p>
    );
  }

  return (
    <div className={styles.tasksTab}>
      {/* Header com Estatísticas */}
      <div className={styles.tasksHeader}>
        <h2>Todas as Tarefas do Projeto</h2>
        
        <div className={styles.taskStats}>
          <div className={styles.taskStatItem}>
            <span className={styles.taskStatLabel}>Total</span>
            <span className={styles.taskStatValue}>{stats.total}</span>
          </div>
          <div className={styles.taskStatItem}>
            <span className={styles.taskStatLabel}>Pendentes</span>
            <span className={styles.taskStatValue}>{stats.pendentes}</span>
          </div>
          <div className={styles.taskStatItem}>
            <span className={styles.taskStatLabel}>Em Progresso</span>
            <span className={styles.taskStatValue}>{stats.emProgresso}</span>
          </div>
          <div className={styles.taskStatItem}>
            <span className={styles.taskStatLabel}>Concluídas</span>
            <span className={styles.taskStatValue}>{stats.concluidas}</span>
          </div>
          {stats.atrasadas > 0 && (
            <div className={styles.taskStatItem} style={{ color: '#ef4444' }}>
              <span className={styles.taskStatLabel}>Atrasadas</span>
              <span className={styles.taskStatValue}>{stats.atrasadas}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.taskFilters}>
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="EM_PROGRESSO">Em Progresso</option>
            <option value="AGUARDANDO_ENTREGA">Aguardando Entrega</option>
            <option value="ENTREGA_RECEBIDA">Entrega Recebida</option>
            <option value="APROVADA">Aprovadas</option>
            <option value="CONCLUIDA">Concluídas</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Prioridade:</label>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todas</option>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>

        <div className={styles.filterInfo}>
          Exibindo {filteredTasks.length} de {tasks.length} tarefas
        </div>
      </div>

      {/* Lista de Tarefas */}
      {filteredTasks.length === 0 ? (
        <p className={styles.emptyState}>Nenhuma tarefa encontrada com os filtros selecionados.</p>
      ) : (
        <div className={styles.tasksList}>
          {filteredTasks.map((task) => {
            const statusLabel = LABELS_STATUS_TAREFA[task.status] || task.status;
            const statusColor = CORES_STATUS_TAREFA[task.status] || '#6b7280';
            
            const priorityLabel = LABELS_PRIORIDADE[task.prioridade] || task.prioridade;
            const priorityColor = CORES_PRIORIDADE[task.prioridade] || '#6b7280';

            const isLate = isOverdue(task.prazo);
            const isNearDeadline = isDeadlineNear(task.prazo);

            return (
              <div 
                key={task.id} 
                className={`${styles.taskCard} ${isLate ? styles.taskCardOverdue : ''}`}
              >
                {/* Header da Tarefa */}
                <div className={styles.taskHeader}>
                  <div className={styles.taskTitleGroup}>
                    <h3>{task.titulo}</h3>
                    <span className={styles.taskActivity}>
                      {task.atividade_nome}
                    </span>
                  </div>

                  <div className={styles.taskBadges}>
                    {/* Badge de Status */}
                    <span
                      className={styles.taskStatus}
                      style={{
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                        border: `1px solid ${statusColor}30`
                      }}
                    >
                      {statusLabel}
                    </span>

                    {/* Badge de Prioridade */}
                    <span
                      className={styles.taskPriority}
                      style={{
                        backgroundColor: `${priorityColor}15`,
                        color: priorityColor,
                        border: `1px solid ${priorityColor}30`
                      }}
                    >
                      {priorityLabel}
                    </span>
                  </div>
                </div>

                {/* Descrição */}
                <p className={styles.taskDesc}>{task.descricao}</p>

                {/* Footer com Info */}
                <div className={styles.taskFooter}>
                  <div className={styles.taskInfo}>
                    <span>
                      <strong>Prazo:</strong> 
                      <span className={isLate ? styles.overdue : isNearDeadline ? styles.nearDeadline : ''}>
                        {formatDate(task.prazo)}
                        {isLate && ' ⚠️ Atrasada'}
                        {!isLate && isNearDeadline && ' ⏰ Próxima'}
                      </span>
                    </span>
                    
                    <span>
                      <strong>Valor:</strong> {formatCurrency(task.valor)}
                    </span>

                    {task.freelancer_id && (
                      <span>
                        <strong>Freelancer:</strong> #{task.freelancer_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}