import React, { useState, useEffect } from 'react';
import { ContractRepository } from '../../../../repositories/ContractRepository';
import { generateContractHTML } from '../../../../utils/contractTemplate';
import { STATUS_CONTRATO } from '../../../../utils/constants';
import styles from './styles.module.css';

/**
 * UC-Contratos: Visualizar Contrato
 * - PDF gerado
 * - Download
 * - Visualização em tela
 */
const ContractView = ({ contractId, onClose }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadContract();
  }, [contractId]);

  const loadContract = async () => {
    try {
      setLoading(true);
      const data = await ContractRepository.getById(contractId);
      setContract(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const blob = await ContractRepository.downloadPDF(contractId);
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrato-${contractId}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Download do contrato iniciado!');
    } catch (err) {
      alert('Erro ao fazer download: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando contrato...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Erro ao carregar contrato: {error}</p>
          <button onClick={onClose} className={styles.btnClose}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  const getStatusBadge = () => {
    const statusColors = {
      [STATUS_CONTRATO.ATIVO]: '#10b981',
      [STATUS_CONTRATO.CONCLUIDO]: '#3b82f6',
      [STATUS_CONTRATO.CANCELADO]: '#ef4444'
    };

    const statusLabels = {
      [STATUS_CONTRATO.ATIVO]: 'Ativo',
      [STATUS_CONTRATO.CONCLUIDO]: 'Concluído',
      [STATUS_CONTRATO.CANCELADO]: 'Cancelado'
    };

    return (
      <span 
        className={styles.statusBadge}
        style={{ backgroundColor: statusColors[contract.status] }}
      >
        {statusLabels[contract.status]}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Contrato #{contract.id}</h2>
          {getStatusBadge()}
        </div>
        <div className={styles.headerRight}>
          <button 
            onClick={handlePrint}
            className={styles.btnPrint}
            title="Imprimir"
          >
            🖨️ Imprimir
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={styles.btnDownload}
            title="Baixar PDF"
          >
            {downloading ? '⏳ Gerando...' : '📥 Baixar PDF'}
          </button>
          <button 
            onClick={onClose}
            className={styles.btnClose}
            title="Fechar"
          >
            ✕
          </button>
        </div>
      </div>

      <div className={styles.contractInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Projeto:</span>
          <span className={styles.infoValue}>{contract.projeto?.titulo || 'N/A'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Valor Total:</span>
          <span className={styles.infoValue}>
            R$ {contract.valor_total?.toFixed(2) || '0,00'}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Período:</span>
          <span className={styles.infoValue}>
            {contract.data_inicio ? new Date(contract.data_inicio).toLocaleDateString('pt-BR') : 'N/A'} 
            {' até '}
            {contract.data_fim ? new Date(contract.data_fim).toLocaleDateString('pt-BR') : 'N/A'}
          </span>
        </div>
      </div>

      <div className={styles.signaturesStatus}>
        <h3>Status das Assinaturas</h3>
        <div className={styles.signaturesGrid}>
          <div className={styles.signatureItem}>
            <span className={styles.signatureLabel}>Empresa:</span>
            <span className={contract.assinado_empresa ? styles.signed : styles.pending}>
              {contract.assinado_empresa ? '✓ Assinado' : '⏳ Pendente'}
            </span>
          </div>
          <div className={styles.signatureItem}>
            <span className={styles.signatureLabel}>Freelancer:</span>
            <span className={contract.assinado_freelancer ? styles.signed : styles.pending}>
              {contract.assinado_freelancer ? '✓ Assinado' : '⏳ Pendente'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contractContent}>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: generateContractHTML(contract.termos) 
          }}
        />
      </div>
    </div>
  );
};

export default ContractView;