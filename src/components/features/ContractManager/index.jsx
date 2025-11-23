
import React, { useState, useEffect } from 'react';
import { ContractRepository } from '../../../../repositories/ContractRepository';
import ContractView from '../ContractView';
import { STATUS_CONTRATO } from '../../../../utils/constants';
import styles from './styles.module.css';

/**
 * UC-Contratos: Gerenciar Contrato
 * - Gerar contrato
 * - Assinar contrato (empresa e freelancer)
 * - Visualizar contrato
 * - Status do contrato
 */
const ContractManager = ({ projectId, currentUser, onContractChange }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [signing, setSigning] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showContractView, setShowContractView] = useState(false);

  useEffect(() => {
    loadContract();
  }, [projectId]);

  const loadContract = async () => {
    try {
      setLoading(true);
      const data = await ContractRepository.getByProject(projectId);
      setContract(data);
    } catch (err) {
      console.error('Erro ao carregar contrato:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * UC-Contratos: Gerar contrato
   * - Template de contrato
   * - Preencher dados automaticamente
   * - Termos e condições
   */
  const handleGenerateContract = async () => {
    if (!window.confirm('Deseja gerar um novo contrato para este projeto?')) {
      return;
    }

    try {
      setGenerating(true);
      const newContract = await ContractRepository.create(projectId);
      setContract(newContract);
      onContractChange && onContractChange(newContract);
      alert('Contrato gerado com sucesso!');
    } catch (err) {
      alert('Erro ao gerar contrato: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  /**
   * UC-Contratos: Assinar contrato
   * - Assinatura digital (empresa ou freelancer)
   */
  const handleSign = async () => {
    const isCompany = currentUser.tipo_usuario === 'EMPRESA';
    const isFreelancer = currentUser.tipo_usuario === 'FREELANCER';

    if (!isCompany && !isFreelancer) {
      alert('Apenas empresa ou freelancer podem assinar o contrato');
      return;
    }

    const alreadySigned = isCompany 
      ? contract.assinado_empresa 
      : contract.assinado_freelancer;

    if (alreadySigned) {
      alert('Você já assinou este contrato');
      return;
    }

    if (!window.confirm('Confirma a assinatura digital deste contrato?')) {
      return;
    }

    try {
      setSigning(true);
      const updatedContract = isCompany
        ? await ContractRepository.signByCompany(contract.id)
        : await ContractRepository.signByFreelancer(contract.id);
      
      setContract(updatedContract);
      onContractChange && onContractChange(updatedContract);
      
      // Verifica se ambos assinaram
      if (updatedContract.assinado_empresa && updatedContract.assinado_freelancer) {
        alert('Contrato assinado com sucesso! Todas as partes assinaram o contrato.');
      } else {
        alert('Assinatura registrada! Aguardando assinatura da outra parte.');
      }
    } catch (err) {
      alert('Erro ao assinar contrato: ' + err.message);
    } finally {
      setSigning(false);
    }
  };

  const handleCancelContract = async () => {
    if (!cancelReason.trim()) {
      alert('Por favor, informe o motivo do cancelamento');
      return;
    }

    try {
      setCancelling(true);
      const updatedContract = await ContractRepository.cancel(contract.id, cancelReason);
      setContract(updatedContract);
      onContractChange && onContractChange(updatedContract);
      setShowCancelModal(false);
      setCancelReason('');
      alert('Contrato cancelado com sucesso');
    } catch (err) {
      alert('Erro ao cancelar contrato: ' + err.message);
    } finally {
      setCancelling(false);
    }
  };

  const renderContractStatus = () => {
    if (!contract) return null;

    const statusConfig = {
      [STATUS_CONTRATO.ATIVO]: {
        color: '#10b981',
        label: 'Ativo',
        icon: '✓'
      },
      [STATUS_CONTRATO.CONCLUIDO]: {
        color: '#3b82f6',
        label: 'Concluído',
        icon: '🏆'
      },
      [STATUS_CONTRATO.CANCELADO]: {
        color: '#ef4444',
        label: 'Cancelado',
        icon: '✕'
      }
    };

    const config = statusConfig[contract.status];

    return (
      <div className={styles.statusCard} style={{ borderLeftColor: config.color }}>
        <div className={styles.statusIcon} style={{ color: config.color }}>
          {config.icon}
        </div>
        <div className={styles.statusInfo}>
          <span className={styles.statusLabel}>Status do Contrato</span>
          <span className={styles.statusValue} style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>
    );
  };

  const renderSignatureStatus = () => {
    if (!contract) return null;

    const bothSigned = contract.assinado_empresa && contract.assinado_freelancer;

    return (
      <div className={styles.signaturesCard}>
        <h3>Assinaturas</h3>
        <div className={styles.signaturesList}>
          <div className={styles.signatureItem}>
            <span className={styles.signatureRole}>Empresa</span>
            <span className={contract.assinado_empresa ? styles.signed : styles.pending}>
              {contract.assinado_empresa ? '✓ Assinado' : '⏳ Pendente'}
            </span>
          </div>
          <div className={styles.signatureItem}>
            <span className={styles.signatureRole}>Freelancer</span>
            <span className={contract.assinado_freelancer ? styles.signed : styles.pending}>
              {contract.assinado_freelancer ? '✓ Assinado' : '⏳ Pendente'}
            </span>
          </div>
        </div>
        {bothSigned && (
          <div className={styles.allSignedBanner}>
            🎉 Contrato totalmente assinado e válido!
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Carregando informações do contrato...</div>;
  }

  // Sem contrato ainda
  if (!contract) {
    return (
      <div className={styles.container}>
        <div className={styles.noContract}>
          <div className={styles.noContractIcon}>📄</div>
          <h3>Nenhum contrato gerado</h3>
          <p>Este projeto ainda não possui um contrato.</p>
          <button
            onClick={handleGenerateContract}
            disabled={generating}
            className={styles.btnGenerate}
          >
            {generating ? '⏳ Gerando...' : '📝 Gerar Contrato'}
          </button>
        </div>
      </div>
    );
  }

  // Com contrato
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gerenciar Contrato</h2>
      </div>

      <div className={styles.content}>
        {renderContractStatus()}
        {renderSignatureStatus()}

        <div className={styles.contractDetails}>
          <h3>Detalhes do Contrato</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Valor Total</span>
              <span className={styles.detailValue}>
                R$ {contract.valor_total?.toFixed(2) || '0,00'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Data de Início</span>
              <span className={styles.detailValue}>
                {contract.data_inicio 
                  ? new Date(contract.data_inicio).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Data de Término</span>
              <span className={styles.detailValue}>
                {contract.data_fim 
                  ? new Date(contract.data_fim).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Criado em</span>
              <span className={styles.detailValue}>
                {new Date(contract.criado_em).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => setShowContractView(true)}
            className={styles.btnView}
          >
            👁️ Visualizar Contrato Completo
          </button>

          {contract.status === STATUS_CONTRATO.ATIVO && (
            <>
              {!contract.assinado_empresa || !contract.assinado_freelancer ? (
                <button
                  onClick={handleSign}
                  disabled={signing}
                  className={styles.btnSign}
                >
                  {signing ? '⏳ Assinando...' : '✍️ Assinar Contrato'}
                </button>
              ) : null}

              <button
                onClick={() => setShowCancelModal(true)}
                className={styles.btnCancel}
              >
                🚫 Cancelar Contrato
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Cancelar Contrato</h3>
            <p>Por favor, informe o motivo do cancelamento:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Descreva o motivo do cancelamento..."
              className={styles.textarea}
              rows={4}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className={styles.btnModalCancel}
                disabled={cancelling}
              >
                Voltar
              </button>
              <button
                onClick={handleCancelContract}
                disabled={cancelling || !cancelReason.trim()}
                className={styles.btnModalConfirm}
              >
                {cancelling ? '⏳ Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualização do Contrato */}
      {showContractView && (
        <div className={styles.modal}>
          <div className={styles.modalContentLarge}>
            <ContractView
              contractId={contract.id}
              onClose={() => setShowContractView(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManager;