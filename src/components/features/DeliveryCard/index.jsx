import { formatDateTime } from "../../../utils/formatters";
import { LABELS_STATUS_ENTREGA, CORES_STATUS_TAREFA } from "../../../utils/constants";
import Button from "../../ui/Button";
import styles from "./DeliveryCard.module.css";

export default function DeliveryCard({ 
  delivery, 
  onApprove, 
  onReject, 
  onRequestRevision,
  showActions = true,
  isEmpresa = false
}) {
  const statusLabel = LABELS_STATUS_ENTREGA[delivery.status] || delivery.status;
  const statusColor = CORES_STATUS_TAREFA[delivery.status] || '#6b7280';

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h4>Entrega #{delivery.id}</h4>
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
      </div>

      {/* Arquivo */}
      <div className={styles.fileSection}>
        <a 
          href={delivery.arquivo_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.fileLink}
        >
          📎 Ver Arquivo
        </a>
      </div>

      {/* Observações */}
      {delivery.observacoes && (
        <div className={styles.observations}>
          <strong>Observações:</strong>
          <p>{delivery.observacoes}</p>
        </div>
      )}

      {/* Informações */}
      <div className={styles.info}>
        <span>
          <strong>Enviado em:</strong> {formatDateTime(delivery.enviado_em)}
        </span>

        {delivery.aprovado_em && (
          <span>
            <strong>Aprovado em:</strong> {formatDateTime(delivery.aprovado_em)}
          </span>
        )}
      </div>

      {/* Ações (apenas para empresa e status AGUARDANDO_APROVACAO) */}
      {showActions && isEmpresa && delivery.status === 'AGUARDANDO_APROVACAO' && (
        <div className={styles.actions}>
          <Button 
            variant="primary"
            onClick={() => onApprove(delivery.id)}
          >
            ✓ Aprovar
          </Button>

          <Button 
            variant="secondary"
            onClick={() => onRequestRevision(delivery.id)}
            style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
          >
            ↻ Solicitar Revisão
          </Button>

          <Button 
            variant="secondary"
            onClick={() => onReject(delivery.id)}
            style={{ borderColor: '#ef4444', color: '#ef4444' }}
          >
            ✕ Reprovar
          </Button>
        </div>
      )}
    </div>
  );
}