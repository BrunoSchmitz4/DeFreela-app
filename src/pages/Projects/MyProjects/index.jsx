import { useState, useEffect } from "react";
import { useAuth } from "../../../context/authContext";
import { useProjectsContext } from "../../../context/projectContext";
import ProjectCard from "../../../components/ProjectCard";
import CardList from "../../../components/CardList";
import Button from "../../../components/ui/Button";
import CreateProjectModal from "../../../components/features/projects/CreateProjectModal";
import styles from "./MyProjects.module.css";

// Importações de constantes
import { STATUS_PROJETO } from "../../../utils/constants";

function MyProjects() {
  const { user } = useAuth();
  const { 
    projects, 
    loading, 
    cancelProject, 
    deleteProject 
  } = useProjectsContext();

  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Filtra projetos do usuário logado
  const myProjects = projects.filter(p => p.empresa_id === user?.id);

  // Aplica filtro de status
  const filteredProjects = filterStatus === "all" 
    ? myProjects 
    : myProjects.filter(p => p.status === filterStatus);

  // Estatísticas
  const stats = {
    total: myProjects.length,
    planejamento: myProjects.filter(p => p.status === STATUS_PROJETO.PLANEJAMENTO).length,
    emAndamento: myProjects.filter(p => p.status === STATUS_PROJETO.EM_ANDAMENTO).length,
    concluidos: myProjects.filter(p => p.status === STATUS_PROJETO.CONCLUIDO).length,
    cancelados: myProjects.filter(p => p.status === STATUS_PROJETO.CANCELADO).length,
  };

  // UC02 - Handler de criação bem-sucedida
  const handleProjectCreated = (newProject) => {
    // O context já atualizou a lista, apenas fechamos o modal
    setShowModal(false);
  };

  // UC04 - Cancelar projeto
  const handleCancel = async (projectId) => {
    if (!window.confirm("Tem certeza que deseja cancelar este projeto?")) {
      return;
    }

    try {
      await cancelProject(projectId);
      alert("Projeto cancelado com sucesso!");
    } catch (err) {
      console.error("Erro ao cancelar projeto:", err);
      alert("Erro ao cancelar projeto. Tente novamente.");
    }
  };

  // UC05 - Deletar projeto (apenas se cancelado)
  const handleDelete = async (project) => {
    if (project.status !== STATUS_PROJETO.CANCELADO) {
      alert("Apenas projetos cancelados podem ser excluídos.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja EXCLUIR este projeto permanentemente?")) {
      return;
    }

    try {
      await deleteProject(project.id);
      alert("Projeto excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
      alert("Erro ao excluir projeto. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando projetos...</p>
      </div>
    );
  }

  const projectCards = filteredProjects.map((p) => {
    return (
      <div key={p.id} className={styles.projectWrapper}>
        <ProjectCard project={p} />

        <div className={styles.projectActions}>
          {/* UC04 - Cancelar (se não estiver cancelado/concluído) */}
          {p.status !== STATUS_PROJETO.CANCELADO && 
           p.status !== STATUS_PROJETO.CONCLUIDO && (
            <Button 
              variant="secondary"
              onClick={() => handleCancel(p.id)}
              style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
            >
              Cancelar
            </Button>
          )}

          {/* UC05 - Excluir (apenas se cancelado) */}
          {p.status === STATUS_PROJETO.CANCELADO && (
            <Button
              variant="secondary"
              onClick={() => handleDelete(p)}
              style={{ 
                borderColor: '#ef4444', 
                color: '#ef4444',
                backgroundColor: '#fef2f2'
              }}
            >
              Excluir
            </Button>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      {/* Header com Estatísticas */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1>Meus Projetos</h1>
          <Button onClick={() => setShowModal(true)}>+ Novo Projeto</Button>
        </div>

        {/* Estatísticas */}
        {myProjects.length > 0 && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Planejamento</span>
              <span className={styles.statValue}>{stats.planejamento}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Em Andamento</span>
              <span className={styles.statValue}>{stats.emAndamento}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Concluídos</span>
              <span className={styles.statValue}>{stats.concluidos}</span>
            </div>
            {stats.cancelados > 0 && (
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Cancelados</span>
                <span className={styles.statValue}>{stats.cancelados}</span>
              </div>
            )}
          </div>
        )}

        {/* Filtros */}
        {myProjects.length > 0 && (
          <div className={styles.filterRow}>
            <label>Filtrar por status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos ({myProjects.length})</option>
              <option value={STATUS_PROJETO.PLANEJAMENTO}>
                Planejamento ({stats.planejamento})
              </option>
              <option value={STATUS_PROJETO.EM_ANDAMENTO}>
                Em Andamento ({stats.emAndamento})
              </option>
              <option value={STATUS_PROJETO.CONCLUIDO}>
                Concluídos ({stats.concluidos})
              </option>
              {stats.cancelados > 0 && (
                <option value={STATUS_PROJETO.CANCELADO}>
                  Cancelados ({stats.cancelados})
                </option>
              )}
            </select>
          </div>
        )}
      </header>

      {/* Lista de Projetos */}
      {filteredProjects.length === 0 ? (
        <div className={styles.emptyState}>
          {myProjects.length === 0 ? (
            <>
              <p>Você ainda não criou nenhum projeto.</p>
              <Button onClick={() => setShowModal(true)}>
                Criar Primeiro Projeto
              </Button>
            </>
          ) : (
            <p>Nenhum projeto encontrado com o filtro selecionado.</p>
          )}
        </div>
      ) : (
        <div className={styles.projectList}>
          <CardList renderItem={projectCards} />
        </div>
      )}

      {/* UC02 - Modal de Criação */}
      <CreateProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleProjectCreated}
      />
    </div>
  );
}

export default MyProjects;