import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { PaymentRepository } from "../../repos/PaymentRepository";
import Button from "../../components/ui/Button";
import PaymentModal from "../../components/features/payments/PaymentModal";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { 
  LABELS_METODO_PAGAMENTO, 
  STATUS_PAGAMENTO 
} from "../../utils/constants";
import styles from "./Payments.module.css";

export default function Payments() {
  const { user } = useAuth();
  const isEmpresa = user?.tipo_usuario === 'EMPRESA';

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFreelancer, setFilterFreelancer] = useState("all");

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    pagos: 0,
    totalPendente: 0,
    totalPago: 0
  });

  useEffect(() => {
    loadPayments();
  }, [user]);

  async function loadPayments() {
    setLoading(true);
    try {
      const list = await PaymentRepository.getAll();
      setPayments(list);
      calculateStats(list);
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(paymentsList) {
    const pendentes = paymentsList.filter(p => p.status === STATUS_PAGAMENTO.PENDENTE);
    const pagos = paymentsList.filter(p => p.status === STATUS_PAGAMENTO.PAGO);

    setStats({
      total: paymentsList.length,
      pendentes: pendentes.length,
      pagos: pagos.length,
      totalPendente: pendentes.reduce((sum, p) => sum + parseFloat(p.valor), 0),
      totalPago: pagos.reduce((sum, p) => sum + parseFloat(p.valor), 0)
    });
  }

  const handleCreatePayment = async (payload) => {
    try {
      await PaymentRepository.create(payload);
      alert("Pagamento registrado com sucesso!");
      loadPayments();
    } catch (err) {
      throw err;
    }
  };

  const handleExecutePayment = async (id) => {
    if (!window.confirm("Confirmar efetivação do pagamento?")) return;

    try {
      await PaymentRepository.execute(id);
      alert("Pagamento efetuado com sucesso!");
      loadPayments();
    } catch (err) {
      console.error("Erro ao efetuar pagamento:", err);
      alert("Erro ao efetuar pagamento. Tente novamente.");
    }
  };

  const handleCancelPayment = async (id) => {
    const motivo = window.prompt("Motivo do cancelamento:");
    if (!motivo) return;

    try {
      await PaymentRepository.cancel(id, motivo);
      alert("Pagamento cancelado!");
      loadPayments();
    } catch (err) {
      console.error("Erro ao cancelar pagamento:", err);
      alert("Erro ao cancelar pagamento. Tente novamente.");
    }
  };

  // Filtros
  const filteredPayments = payments.filter(p => {
    const statusMatch = filterStatus === "all" || p.status === filterStatus;
    const freelancerMatch = filterFreelancer === "all" || String(p.freelancer_id) === filterFreelancer;
    return statusMatch && freelancerMatch;
  });

  // Lista única de freelancers
  const uniqueFreelancers = [...new Set(payments.map(p => p.freelancer_id))];

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando pagamentos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1>💰 Pagamentos</h1>
          {isEmpresa && (
            <Button onClick={() => setShowModal(true)}>
              + Registrar Pagamento
            </Button>
          )}
        </div>

        {/* Estatísticas */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pendentes</span>
            <span className={styles.statValue} style={{ color: '#f59e0b' }}>
              {stats.pendentes}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pagos</span>
            <span className={styles.statValue} style={{ color: '#10b981' }}>
              {stats.pagos}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Valor Pendente</span>
            <span className={styles.statValue} style={{ fontSize: '1.2rem', color: '#f59e0b' }}>
              {formatCurrency(stats.totalPendente)}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Pago</span>
            <span className={styles.statValue} style={{ fontSize: '1.2rem', color: '#10b981' }}>
              {formatCurrency(stats.totalPago)}
            </span>
          </div>
        </div>

        {/* Filtros */}
        {payments.length > 0 && (
          <div className={styles.filtersRow}>
            <div className={styles.filterGroup}>
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todos</option>
                <option value={STATUS_PAGAMENTO.PENDENTE}>Pendentes</option>
                <option value={STATUS_PAGAMENTO.PROCESSANDO}>Processando</option>
                <option value={STATUS_PAGAMENTO.PAGO}>Pagos</option>
                <option value={STATUS_PAGAMENTO.CANCELADO}>Cancelados</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Freelancer:</label>
              <select
                value={filterFreelancer}
                onChange={(e) => setFilterFreelancer(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todos</option>
                {uniqueFreelancers.map(fId => (
                  <option key={fId} value={fId}>
                    Freelancer #{fId}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterInfo}>
              Exibindo {filteredPayments.length} de {payments.length} pagamentos
            </div>
          </div>
        )}
      </header>

      {/* Lista de Pagamentos */}
      {filteredPayments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💸</div>
          <h2>Nenhum pagamento encontrado</h2>
          {isEmpresa && (
            <>
              <p>Registre pagamentos para freelancers ao concluir tarefas ou projetos.</p>
              <Button onClick={() => setShowModal(true)}>
                Registrar Primeiro Pagamento
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.paymentsList}>
          {filteredPayments.map(payment => {
            const isPendente = payment.status === STATUS_PAGAMENTO.PENDENTE;
            const isPago = payment.status === STATUS_PAGAMENTO.PAGO;
            const isCancelado = payment.status === STATUS_PAGAMENTO.CANCELADO;

            let statusColor = '#6b7280';
            if (isPendente) statusColor = '#f59e0b';
            if (isPago) statusColor = '#10b981';
            if (isCancelado) statusColor = '#ef4444';

            return (
              <div key={payment.id} className={styles.paymentCard}>
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <h3>Pagamento #{payment.id}</h3>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                        border: `1px solid ${statusColor}30`
                      }}
                    >
                      {payment.status}
                    </span>
                  </div>

                  <div className={styles.cardValue}>
                    {formatCurrency(payment.valor)}
                  </div>
                </div>

                {/* Informações */}
                <div className={styles.cardInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Freelancer:</span>
                    <span>#{payment.freelancer_id}</span>
                  </div>

                  {payment.tarefa_id && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Tarefa:</span>
                      <span>#{payment.tarefa_id}</span>
                    </div>
                  )}

                  {payment.projeto_id && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Projeto:</span>
                      <span>#{payment.projeto_id}</span>
                    </div>
                  )}

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Método:</span>
                    <span>{LABELS_METODO_PAGAMENTO[payment.metodo_pagamento]}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Data:</span>
                    <span>{formatDate(payment.data_pagamento)}</span>
                  </div>

                  {payment.observacoes && (
                    <div className={styles.observations}>
                      <strong>Observações:</strong>
                      <p>{payment.observacoes}</p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                {isEmpresa && (
                  <div className={styles.cardActions}>
                    {isPendente && (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleExecutePayment(payment.id)}
                        >
                          ✓ Efetuar Pagamento
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => handleCancelPayment(payment.id)}
                          style={{ borderColor: '#ef4444', color: '#ef4444' }}
                        >
                          ✕ Cancelar
                        </Button>
                      </>
                    )}

                    {isPago && (
                      <span className={styles.paidLabel}>
                        ✓ Pago em {formatDate(payment.data_pagamento)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Registro */}
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePayment}
      />
    </div>
  );
}