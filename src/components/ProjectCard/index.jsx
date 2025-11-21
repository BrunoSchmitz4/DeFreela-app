import { Link } from "react-router-dom";
import Button from "../ui/Button";
import styles from "./ProjectCard.module.css";

// Importações das constantes
import { 
  LABELS_STATUS_PROJETO, 
  CORES_STATUS_PROJETO 
} from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/formatters";

/**
 * Card de Projeto Refatorado
 * Alinhado com schema PostgreSQL
 */
function ProjectCard({ project }) {
  const statusLabel = LABELS_STATUS_PROJETO[project.status] || project.status;
  const statusColor = CORES_STATUS_PROJETO[project.status] || '#6b7280';

  return (
    <Link
      to={`/projects/${project.id}`}
      className={styles.projectCardComponent}
    >
      {/* Título */}
      <h3 className={styles.projectCardTitle}>{project.titulo}</h3>

      {/* Descrição */}
      <p className={styles.projectCardDesc}>
        {project.descricao?.length > 100
          ? `${project.descricao.substring(0, 100)}...`
          : project.descricao}
      </p>

      <div className={styles.projectCardInfos}>
        {/* Status com Badge Inline */}
        <div className={styles.statusBadge}>
          <span
            className={styles.badge}
            style={{
              backgroundColor: `${statusColor}15`,
              color: statusColor,
              border: `1px solid ${statusColor}30`
            }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Orçamento */}
        {project.orcamento_total && (
          <p className={styles.projectCardValue}>
            <strong>Orçamento:</strong> {formatCurrency(project.orcamento_total)}
          </p>
        )}

        {/* Datas */}
        {project.data_inicio && (
          <p className={styles.projectCardDate}>
            <strong>Início:</strong> {formatDate(project.data_inicio)}
          </p>
        )}

        {project.data_fim_prevista && (
          <p className={styles.projectCardDate}>
            <strong>Previsão:</strong> {formatDate(project.data_fim_prevista)}
          </p>
        )}

        {/* Nome da Empresa (se disponível) */}
        {project.empresa?.nome_empresa && (
          <p className={styles.projectCardCompany}>
            <strong>Empresa:</strong> {project.empresa.nome_empresa}
          </p>
        )}
      </div>

      {/* Botão */}
      <div className={styles.projectCardButton}>
        <Button variant="secondary">Ver detalhes</Button>
      </div>
    </Link>
  );
}

export default ProjectCard;