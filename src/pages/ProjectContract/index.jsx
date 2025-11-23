// Exemplo de uso do ContractManager em uma página de projeto

import React, { useState, useEffect } from 'react';
import ContractManager from '../components/features/contracts/ContractManager';
import { ProjectRepository } from '../repositories/ProjectRepository';
import styles from './ProjectContractPage.module.css';

/**
 * Página de exemplo para gerenciar contrato de um projeto
 * UC-Contratos: Integração completa
 */
const ProjectContractPage = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState({
    id: 1,
    tipo_usuario: 'EMPRESA', // ou 'FREELANCER'
    nome_empresa: 'Tech Solutions Ltda'
  });

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await ProjectRepository.getById(projectId);
      setProject(data);
    } catch (err) {
      console.error('Erro ao carregar projeto:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContractChange = (updatedContract) => {
    console.log('Contrato atualizado:', updatedContract);
    // Aqui você pode atualizar o estado do projeto ou fazer outras ações
  };

  if (loading) {
    return <div className={styles.loading}>Carregando projeto...</div>;
  }

  if (!project) {
    return <div className={styles.error}>Projeto não encontrado</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{project.titulo}</h1>
        <p className={styles.description}>{project.descricao}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.projectInfo}>
          <h2>Informações do Projeto</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Status:</span>
              <span className={styles.value}>{project.status}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Orçamento:</span>
              <span className={styles.value}>
                R$ {project.orcamento_total?.toFixed(2) || '0,00'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Prazo:</span>
              <span className={styles.value}>
                {project.data_inicio && project.data_fim_prevista
                  ? `${new Date(project.data_inicio).toLocaleDateString('pt-BR')} - ${new Date(project.data_fim_prevista).toLocaleDateString('pt-BR')}`
                  : 'Não definido'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.contractSection}>
          <ContractManager
            projectId={projectId}
            currentUser={currentUser}
            onContractChange={handleContractChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectContractPage;