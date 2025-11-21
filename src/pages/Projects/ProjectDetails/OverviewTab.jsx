// src/pages/Projects/ProjectDetails/OverviewTab.jsx
import { calculateProgress } from "../../../utils/formatters";
import styles from "./ProjectDetails.module.css";

export default function OverviewTab({ project, activities }) {
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === 'CONCLUIDA').length;
  const progress = calculateProgress(completedActivities, totalActivities);

  return (
    <div className={styles.overviewTab}>
      <section className={styles.section}>
        <h2>Resumo do Projeto</h2>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Atividades</span>
            <span className={styles.statValue}>{totalActivities}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Concluídas</span>
            <span className={styles.statValue}>{completedActivities}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Progresso</span>
            <span className={styles.statValue}>{progress}%</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Freelancers</span>
            <span className={styles.statValue}>
              {project.freelancers_atribuidos?.length || 0}
            </span>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className={styles.progressBar}>
          <div className={styles.progressLabel}>
            <span>Progresso Geral</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Descrição Completa</h2>
        <p className={styles.fullDescription}>{project.descricao}</p>
      </section>
    </div>
  );
}