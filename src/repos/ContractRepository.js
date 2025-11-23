// src/repositories/ContractRepository.js

const BASE_URL = '/api/contracts';

export const ContractRepository = {
  /**
   * UC-Contratos: Listar todos os contratos
   */
  async getAll() {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Erro ao buscar contratos');
    return response.json();
  },

  /**
   * UC-Contratos: Buscar contrato por ID
   */
  async getById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Contrato não encontrado');
    return response.json();
  },

  /**
   * UC-Contratos: Buscar contrato por projeto
   */
  async getByProject(projectId) {
    const response = await fetch(`${BASE_URL}?projeto_id=${projectId}`);
    if (!response.ok) throw new Error('Erro ao buscar contrato do projeto');
    const contracts = await response.json();
    return contracts.length > 0 ? contracts[0] : null;
  },

  /**
   * UC-Contratos: Gerar contrato (criar)
   * Gera automaticamente o template com dados do projeto
   */
  async create(projectId) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projeto_id: projectId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao gerar contrato');
    }
    
    return response.json();
  },

  /**
   * UC-Contratos: Assinar contrato (empresa)
   */
  async signByCompany(contractId) {
    const response = await fetch(`${BASE_URL}/${contractId}/sign-company`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao assinar contrato');
    }
    
    return response.json();
  },

  /**
   * UC-Contratos: Assinar contrato (freelancer)
   */
  async signByFreelancer(contractId) {
    const response = await fetch(`${BASE_URL}/${contractId}/sign-freelancer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao assinar contrato');
    }
    
    return response.json();
  },

  /**
   * UC-Contratos: Cancelar contrato
   */
  async cancel(contractId, motivo) {
    const response = await fetch(`${BASE_URL}/${contractId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao cancelar contrato');
    }
    
    return response.json();
  },

  /**
   * UC-Contratos: Concluir contrato
   */
  async complete(contractId) {
    const response = await fetch(`${BASE_URL}/${contractId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao concluir contrato');
    }
    
    return response.json();
  },

  /**
   * UC-Contratos: Gerar PDF do contrato
   */
  async downloadPDF(contractId) {
    const response = await fetch(`${BASE_URL}/${contractId}/pdf`);
    if (!response.ok) throw new Error('Erro ao gerar PDF');
    
    const blob = await response.blob();
    return blob;
  }
};