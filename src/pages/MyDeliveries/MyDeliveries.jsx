import { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useDeliveryContext } from "../../../context/deliveryContext";
import { DeliveryRepository } from "../../../repos/DeliveryRepository";
import DeliveryCard from "../../../components/features/deliveries/DeliveryCard";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import styles from "./MyDeliveries.module.css";

export default function MyDeliveries() {
  const { user } = useAuth();
  const { 
    deliveries, 
    loading, 
    approveDelivery, 
    rejectDelivery, 
    requestRevision 
  } = useDeliveryContext();

  const [myDeliveries, setMyDeliveries] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [actionType, setActionType] = useState(null); // 'reject' | 'revision'

  const isEmpresa = user?.tipo_usuario === 'EMPRESA';

  // Carrega entregas do usuário
  useEffect(() => {
    async function loadDeliveries() {
      try {
        if (isEmpresa) {
          // Se for empresa, buscar entregas pendentes de aprovação
          const res = await DeliveryRepository.getPendingApproval();
          setMyDeliveries(res || []);
        } else {
          // Se for freelancer, buscar suas entregas
          const res = await DeliveryRepository.getByFreelancer(user.id);
          setMyDeliveries(res || []);
        }
      } catch (err) {
        console.error("Erro ao carregar entregas:", err);
      }
    }

    if (user) {
      loadDeliveries();
    }
  }, [user, isEmpresa]);

  // Filtrar entregas
  const filteredDeliveries = filterStatus === "all"
    ? myDeliveries
    : myDeliveries.filter(d => d.status === filterStatus);

  // Estatísticas
  const stats = {
    total: myDeliveries.length,
    aguardando: myDeliveries.filter(d => d.status === 'AGUARDANDO_APROVACAO').length,
    aprovadas: myDeliveries.filter(d => d.status === 'APROVADA').length,
    revisao: myDeliveries.filter(d => d.status === 'REVISAO_NECESSARIA').length,
    rejeitadas: myDeliveries.filter(d => d.status === 'REJEITADA').length,
  };

  // Handler de aprovação
  const handleApprove = async (deliveryId) => {
    if (!window.confirm("Tem certeza que deseja aprovar esta entrega?")) return;

    try {
      await approveDelivery(deliveryId, user.id);
      alert("Entrega aprovada com sucesso!");
      
      // Recarrega entregas
      setMyDeliveries(prev => prev.filter(d => d.id !== deliveryId));
    } catch (err) {
      console.error("Erro ao aprovar entrega:", err);
      alert("Erro ao aprovar entrega. Tente novamente.");
    }
  };

  // Handler de rejeição
  const handleReject = (deliveryId) => {
    setSelectedDelivery(deliveryId);
    setActionType('reject');
    setShowFeedbackModal(true);
  };

  // Handler de solicitar revisão
  const handleRequestRevision = (deliveryId) => {
    setSelectedDelivery(deliveryId);
    setActionType('revision');
    setShowFeedbackModal(true);
  };

  // Enviar feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      alert("Por favor, forneça um feedback.");
      return;
    }

    try {
      if (actionType === 'reject') {
        await rejectDelivery(selectedDelivery, feedbackText);
        alert("Entrega reprovada.");
      } else {
        await requestRevision(selectedDelivery, feedbackText);
        alert("Revisão solicitada com sucesso!");
      }

      setShowFeedbackModal(false);
      setFeedbackText("");
      setSelectedDelivery(null);
      setActionType(null);

      // Recarrega entregas
      setMyDeliveries(prev => 
        prev.map(d => d.id === selectedDelivery 
          ? { ...d, status: actionType === 'reject' ? 'REJEITADA' : 'REVISAO_NECESSARIA' }
          : d
        )
      );
    } catch (err) {
      console.error("Erro ao processar feedback:", err);
      alert("Erro ao processar. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando entregas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>{isEmpresa ? "Entregas Pendentes de Aprovação" : "Minhas Entregas"}</h1>

        {/* Estatísticas */}
        {myDeliveries.length > 0 && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Aguardando</span>
              <span className={styles.statValue}>{stats.aguardando}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Aprovadas</span>
              <span className={styles.statValue}>{stats.aprovadas}</span>
            </div>
            {stats.revisao > 0 && (
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Revisão</span>
                <span className={styles.statValue}>{stats.revisao}</span>
              </div>
            )}
            {stats.rejeitadas > 0 && (
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Rejeitadas</span>
                <span className={styles.statValue}>{stats.rejeitadas}</span>
              </div>
            )}
          </div>
        )}

        {/* Filtros */}
        {myDeliveries.length > 0 && (
          <div className={styles.filterRow}>
            <label>Filtrar por status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos ({myDeliveries.length})</option>
              <option value="AGUARDANDO_APROVACAO">
                Aguardando Aprovação ({stats.aguardando})
              </option>
              <option value="APROVADA">
                Aprovadas ({stats.aprovadas})
              </option>
              {stats.revisao > 0 && (
                <option value="REVISAO_NECESSARIA">
                  Revisão Necessária ({stats.revisao})
                </option>
              )}
              {stats.rejeitadas > 0 && (
                <option value="REJEITADA">
                  Rejeitadas ({stats.rejeitadas})
                </option>
              )}
            </select>
          </div>
        )}
      </header>

      {/* Lista de Entregas */}
      {filteredDeliveries.length === 0 ? (
        <div className={styles.emptyState}>
          {myDeliveries.length === 0 ? (
            <p>Nenhuma entrega encontrada.</p>
          ) : (
            <p>Nenhuma entrega com o filtro selecionado.</p>
          )}
        </div>
      ) : (
        <div className={styles.deliveriesList}>
          {filteredDeliveries.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestRevision={handleRequestRevision}
              showActions={true}
              isEmpresa={isEmpresa}
            />
          ))}
        </div>
      )}

      {/* Modal de Feedback */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setFeedbackText("");
          setSelectedDelivery(null);
          setActionType(null);
        }}
        title={actionType === 'reject' ? "Reprovar Entrega" : "Solicitar Revisão"}
      >
        <form onSubmit={handleSubmitFeedback} className={styles.feedbackForm}>
          <p className={styles.feedbackHint}>
            {actionType === 'reject' 
              ? "Explique o motivo da reprovação:"
              : "Descreva as alterações necessárias:"}
          </p>

          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Digite seu feedback aqui..."
            className={styles.textarea}
            rows={6}
            required
          />

          <div className={styles.modalActions}>
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => {
                setShowFeedbackModal(false);
                setFeedbackText("");
              }}
            >
              Cancelar
            </Button>

            <Button type="submit">
              {actionType === 'reject' ? 'Reprovar' : 'Solicitar Revisão'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}