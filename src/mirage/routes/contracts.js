// Adicionar ao server.js existente

import { Response } from 'miragejs';
import { generateContractTemplate } from '../../utils/contracttemplate';

export function contractRoutes(server) {
  
  // ==========================================
  // SEED: Contratos de exemplo
  // ==========================================
  server.create("contract", {
    id: 1,
    projeto_id: 1,
    termos: "Contrato de exemplo gerado automaticamente...",
    valor_total: 15000.00,
    data_inicio: "2025-01-15",
    data_fim: "2025-03-30",
    status: "ATIVO",
    assinado_empresa: true,
    assinado_freelancer: false,
    criado_em: "2025-01-12T14:30:00Z"
  });

  // ==========================================
  // GET /api/contracts - Listar contratos
  // ==========================================
  server.get('/api/contracts', (schema, request) => {
    const { projeto_id } = request.queryParams;
    
    let contracts = schema.contracts.all().models;
    
    if (projeto_id) {
      contracts = contracts.filter(c => c.projeto_id == projeto_id);
    }
    
    return contracts;
  });

  // ==========================================
  // GET /api/contracts/:id - Buscar contrato
  // ==========================================
  server.get('/api/contracts/:id', (schema, request) => {
    const id = request.params.id;
    const contract = schema.contracts.find(id);
    
    if (!contract) {
      return new Response(404, {}, { 
        message: 'Contrato não encontrado' 
      });
    }

    // Buscar projeto relacionado
    const project = schema.projects.find(contract.projeto_id);
    
    return {
      ...contract.attrs,
      projeto: project ? project.attrs : null
    };
  });

  // ==========================================
  // POST /api/contracts - Gerar contrato
  // UC-Contratos: Gerar contrato
  // ==========================================
  server.post('/api/contracts', (schema, request) => {
    const { projeto_id } = JSON.parse(request.requestBody);

    // Validar projeto
    const project = schema.projects.find(projeto_id);
    if (!project) {
      return new Response(404, {}, { 
        message: 'Projeto não encontrado' 
      });
    }

    // Verificar se já existe contrato
    const existingContract = schema.contracts.findBy({ projeto_id });
    if (existingContract) {
      return new Response(400, {}, { 
        message: 'Este projeto já possui um contrato' 
      });
    }

    // Buscar empresa
    const company = schema.users.find(project.empresa_id);
    if (!company) {
      return new Response(404, {}, { 
        message: 'Empresa não encontrada' 
      });
    }

    // Buscar freelancers do projeto
    const freelancerIds = project.freelancers_atribuidos || [];
    const freelancers = freelancerIds.map(id => {
      const user = schema.users.find(id);
      return {
        ...user.attrs,
        papel: 'Desenvolvedor', // Simplificado
        valor_acordado: 5000.00 // Simplificado
      };
    });

    if (freelancers.length === 0) {
      return new Response(400, {}, { 
        message: 'O projeto precisa ter freelancers atribuídos para gerar contrato' 
      });
    }

    // Gerar template do contrato
    const termos = generateContractTemplate(
      project.attrs,
      company.attrs,
      freelancers
    );

    // Criar contrato
    const contract = schema.contracts.create({
      projeto_id,
      termos,
      valor_total: project.orcamento_total || 0,
      data_inicio: project.data_inicio,
      data_fim: project.data_fim_prevista,
      status: 'ATIVO',
      assinado_empresa: false,
      assinado_freelancer: false,
      criado_em: new Date().toISOString()
    });

    return {
      ...contract.attrs,
      projeto: project.attrs
    };
  });

  // ==========================================
  // PATCH /api/contracts/:id/sign-company
  // UC-Contratos: Assinar contrato (empresa)
  // ==========================================
  server.patch('/api/contracts/:id/sign-company', (schema, request) => {
    const id = request.params.id;
    const contract = schema.contracts.find(id);
    
    if (!contract) {
      return new Response(404, {}, { 
        message: 'Contrato não encontrado' 
      });
    }

    if (contract.assinado_empresa) {
      return new Response(400, {}, { 
        message: 'Este contrato já foi assinado pela empresa' 
      });
    }

    contract.update({ assinado_empresa: true });

    return contract.attrs;
  });

  // ==========================================
  // PATCH /api/contracts/:id/sign-freelancer
  // UC-Contratos: Assinar contrato (freelancer)
  // ==========================================
  server.patch('/api/contracts/:id/sign-freelancer', (schema, request) => {
    const id = request.params.id;
    const contract = schema.contracts.find(id);
    
    if (!contract) {
      return new Response(404, {}, { 
        message: 'Contrato não encontrado' 
      });
    }

    if (contract.assinado_freelancer) {
      return new Response(400, {}, { 
        message: 'Este contrato já foi assinado pelo freelancer' 
      });
    }

    contract.update({ assinado_freelancer: true });

    return contract.attrs;
  });

  // ==========================================
  // PATCH /api/contracts/:id/cancel
  // UC-Contratos: Cancelar contrato
  // ==========================================
  server.patch('/api/contracts/:id/cancel', (schema, request) => {
    const id = request.params.id;
    const { motivo } = JSON.parse(request.requestBody);
    
    const contract = schema.contracts.find(id);
    
    if (!contract) {
      return new Response(404, {}, { 
        message: 'Contrato não encontrado' 
      });
    }

    if (contract.status === 'CANCELADO') {
      return new Response(400, {}, { 
        message: 'Este contrato já está cancelado' 
      });
    }

    contract.update({ 
      status: 'CANCELADO',
      motivo_cancelamento: motivo
    });

    return contract.attrs;
  });

  // ==========================================
  // PATCH /api/contracts/:id/complete
  // UC-Contratos: Concluir contrato
  // ==========================================
  server.patch('/api/contracts/:id/complete', (schema, request) => {
    const id = request.params.id;
    const contract = schema.contracts.find(id);
    
    if (!contract) {
      return new Response(404, {}, { 
        message: 'Contrato não encontrado' 
      });
    }

    if (!contract.assinado_empresa || !contract.assinado_freelancer) {
      return new Response(400, {}, { 
        message: 'Não é possível concluir um contrato não assinado por ambas as partes' 
      });
    }

    contract.update({ status: 'CONCLUIDO' });

    return contract.attrs;
  });

  // ==========================================
  // GET /api/contracts/:id/pdf
  // UC-Contratos: Download PDF
  // ==========================================
  server.get('/api/contracts/:id/pdf', (schema, request) => {
    const id = request.params.id;
    const contract = schema.contracts.find(id);
    
    if (!contract) {
      return new Response(404, {}, { 
        message: 'Contrato não encontrado' 
      });
    }

    // Em produção, aqui geraria o PDF de verdade
    // Para o mock, retornamos um blob fake
    return new Response(
      200,
      { 'Content-Type': 'application/pdf' },
      'PDF_MOCK_DATA'
    );
  });
}