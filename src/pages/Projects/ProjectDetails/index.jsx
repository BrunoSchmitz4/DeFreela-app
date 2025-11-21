// src/pages/Projects/ProjectDetails/index.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProjectRepository } from "../../../repos/ProjectRepository";
import { ActivityRepository } from "../../../repos/ActivityRepository";
import Button from "../../../components/ui/Button";
import Tabs from "../../../components/Tabs";
import styles from "./ProjectDetails.module.css";

// Importar constantes
import { LABELS_STATUS_PROJETO, CORES_STATUS_PROJETO } from "../../../utils/constants";
import { formatCurrency, formatDate } from "../../../utils/formatters";

// Sub-componentes (abas)
import OverviewTab from "./OverviewTab";
import ActivitiesTab from "./ActivitiesTab";
import TasksTab from "./TasksTab";
import FreelancersTab from "./FreelancersTabs";

function ProjectDetails() {
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const projectData = await ProjectRepository.getById(id);
        setProject(projectData);

        const activitiesData = await ActivityRepository.getByProject(id);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Erro ao carregar projeto:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando projeto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2>Projeto não encontrado</h2>
        <Link to="/projects/searchProjects">
          <Button>Voltar para busca</Button>
        </Link>
      </div>
    );
  }

  const statusLabel = LABELS_STATUS_PROJETO[project.status] || project.status;
  const statusColor = CORES_STATUS_PROJETO[project.status] || '#6b7280';

  const tabs = ["overview", "atividades", "tarefas", "freelancers"];

  return (
    <div className={styles.container}>
      {/* Header do Projeto */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1>{project.titulo}</h1>
          
          {/* Badge de Status */}
          <span
            className={styles.statusBadge}
            style={{
              backgroundColor: `${statusColor}15`,
              color: statusColor,
              border: `1px solid ${statusColor}30`
            }}
          >
            {statusLabel}
          </span>
        </div>

        <p className={styles.description}>{project.descricao}</p>

        {/* Info Box */}
        <div className={styles.infoBox}>
          <div className={styles.infoItem}>
            <strong>Orçamento:</strong>
            <span>{formatCurrency(project.orcamento_total)}</span>
          </div>

          <div className={styles.infoItem}>
            <strong>Início:</strong>
            <span>{formatDate(project.data_inicio)}</span>
          </div>

          <div className={styles.infoItem}>
            <strong>Previsão de Término:</strong>
            <span>{formatDate(project.data_fim_prevista)}</span>
          </div>
        </div>
      </header>

      {/* Navegação por Abas */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Conteúdo da Aba Ativa */}
      <div className={styles.tabContent}>
        {activeTab === "overview" && (
          <OverviewTab project={project} activities={activities} />
        )}
        
        {activeTab === "atividades" && (
          <ActivitiesTab projectId={project.id} activities={activities} setActivities={setActivities} />
        )}
        
        {activeTab === "tarefas" && (
          <TasksTab projectId={project.id} activities={activities} />
        )}
        
        {activeTab === "freelancers" && (
          <FreelancersTab project={project} />
        )}
      </div>

      {/* Ações */}
      <div className={styles.actions}>
        <Link to="/projects/myProjects">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </div>
    </div>
  );
}

export default ProjectDetails;