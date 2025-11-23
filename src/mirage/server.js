// src/mirage/server.js
import { createServer, Model, Response } from "miragejs";
import { contractRoutes } from './routes/contracts';

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      user: Model,
      empresa: Model,
      freelancer: Model,
      project: Model,
      activity: Model,
      task: Model,
      delivery: Model,
      payment: Model,
      comment: Model,
      notification: Model,
      token: Model,
      contract: Model, // NOVO: Model de contratos
    },

    timing: 600,

    seeds(server) {
      server.db.emptyData();

      // ==========================================
      // USUÁRIOS (Pessoa + Empresa/Freelancer)
      // ==========================================
      
      // Empresa 1
      server.create("user", {
        id: 1,
        email: "empresa1@teste.com",
        tipo_usuario: "EMPRESA",
        nome_empresa: "Tech Solutions Ltda",
        cnpj: "12345678000190",
        telefone: "(11) 98765-4321",
        endereco: "Av. Paulista, 1000 - São Paulo, SP",
        criado_em: "2025-01-10T10:00:00Z"
      });

      // Freelancer 1 - João Designer
      server.create("user", {
        id: 2,
        email: "joao.designer@teste.com",
        tipo_usuario: "FREELANCER",
        nome_completo: "João Silva",
        cpf_cnpj: "12345678901",
        is_pj: false,
        habilidades: "Design Gráfico, UI/UX, Figma, Adobe XD",
        valor_hora: 80.00,
        portfolio_url: "https://portfolio-joao.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        criado_em: "2025-01-05T08:00:00Z"
      });

      // Freelancer 2 - Maria Dev
      server.create("user", {
        id: 3,
        email: "maria.dev@teste.com",
        tipo_usuario: "FREELANCER",
        nome_completo: "Maria Santos",
        cpf_cnpj: "12345678000123",
        is_pj: true,
        habilidades: "React, Node.js, PostgreSQL, TypeScript",
        valor_hora: 120.00,
        portfolio_url: "https://github.com/maria-dev",
        avatar: "https://i.pravatar.cc/150?img=5",
        criado_em: "2025-01-03T09:00:00Z"
      });

      // ==========================================
      // PROJETOS
      // ==========================================
      
      server.create("project", {
        id: 1,
        empresa_id: 1,
        titulo: "Redesign do Site Corporativo",
        descricao: "Modernização completa do site institucional com foco em UX",
        orcamento_total: 15000.00,
        data_inicio: "2025-01-15",
        data_fim_prevista: "2025-03-30",
        status: "EM_ANDAMENTO",
        criado_em: "2025-01-12T14:00:00Z",
        freelancers_atribuidos: [2, 3],
        empresa: {
          id: 1,
          nome_empresa: "Tech Solutions Ltda"
        }
      });

      // ==========================================
      // ATIVIDADES
      // ==========================================
      
      server.create("activity", {
        id: 1,
        projeto_id: 1,
        nome: "Pesquisa e Planejamento",
        descricao: "Análise de concorrentes, personas e jornada do usuário",
        ordem: 1,
        status: "CONCLUIDA",
        criado_em: "2025-01-15T09:00:00Z"
      });

      // ==========================================
      // TAREFAS
      // ==========================================
      
      server.create("task", {
        id: 1,
        atividade_id: 1,
        freelancer_id: 2,
        titulo: "Análise de Concorrentes",
        descricao: "Mapear 5 principais concorrentes e fazer benchmark",
        prioridade: "ALTA",
        prazo: "2025-01-20",
        valor: 800.00,
        status: "CONCLUIDA",
        criado_em: "2025-01-15T10:00:00Z"
      });

      // ==========================================
      // CONTRATOS (SEED DE EXEMPLO)
      // ==========================================
      
      server.create("contract", {
        id: 1,
        projeto_id: 1,
        termos: "Contrato de prestação de serviços...",
        valor_total: 15000.00,
        data_inicio: "2025-01-15",
        data_fim: "2025-03-30",
        status: "ATIVO",
        assinado_empresa: true,
        assinado_freelancer: false,
        criado_em: "2025-01-12T14:30:00Z"
      });
    },

    routes() {
      this.namespace = "api";
      this.timing = 600;

      // ==========================================
      // AUTH - Login/Logout
      // ==========================================
      this.post("/login", (schema, request) => {
        const { email, senha } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email });

        if (!user) {
          return new Response(401, {}, { message: "Credenciais inválidas" });
        }

        const token = schema.tokens.create({
          user_id: user.id,
          token: `fake-jwt-token-${user.id}`,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

        return {
          user: user.attrs,
          token: token.token
        };
      });

      // ==========================================
      // USERS
      // ==========================================
      this.get("/users", (schema) => {
        return schema.users.all();
      });

      this.get("/users/:id", (schema, request) => {
        const id = request.params.id;
        return schema.users.find(id);
      });

      // ==========================================
      // FREELANCERS
      // ==========================================
      this.get("/freelancers", (schema, request) => {
        const queryParams = request.queryParams;
        let freelancers = schema.users.where({ tipo_usuario: "FREELANCER" }).models;

        // Filtro por habilidades
        if (queryParams.habilidade) {
          const skill = queryParams.habilidade.toLowerCase();
          freelancers = freelancers.filter(f => 
            f.habilidades.toLowerCase().includes(skill)
          );
        }

        // Filtro por tipo (PJ/PF)
        if (queryParams.tipo) {
          const isPJ = queryParams.tipo === 'PJ';
          freelancers = freelancers.filter(f => f.is_pj === isPJ);
        }

        // Filtro por valor/hora
        if (queryParams.valor_min) {
          const min = parseFloat(queryParams.valor_min);
          freelancers = freelancers.filter(f => f.valor_hora >= min);
        }
        if (queryParams.valor_max) {
          const max = parseFloat(queryParams.valor_max);
          freelancers = freelancers.filter(f => f.valor_hora <= max);
        }

        return freelancers;
      });

      // ==========================================
      // PROJECTS
      // ==========================================
      this.get("/projects", (schema) => {
        return schema.projects.all();
      });

      this.get("/projects/:id", (schema, request) => {
        const id = request.params.id;
        const project = schema.projects.find(id);
        
        if (!project) {
          return new Response(404, {}, { message: "Projeto não encontrado" });
        }

        return project;
      });

      this.post("/projects", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const project = schema.projects.create({
          ...attrs,
          status: "PLANEJAMENTO",
          criado_em: new Date().toISOString(),
          freelancers_atribuidos: []
        });
        return project;
      });

      this.patch("/projects/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const project = schema.projects.find(id);
        
        if (!project) {
          return new Response(404, {}, { message: "Projeto não encontrado" });
        }

        project.update(attrs);
        return project;
      });

      this.delete("/projects/:id", (schema, request) => {
        const id = request.params.id;
        const project = schema.projects.find(id);
        
        if (!project) {
          return new Response(404, {}, { message: "Projeto não encontrado" });
        }

        if (project.status !== "CANCELADO") {
          return new Response(400, {}, { 
            message: "Apenas projetos cancelados podem ser excluídos" 
          });
        }

        project.destroy();
        return new Response(204);
      });

      // ==========================================
      // ACTIVITIES
      // ==========================================
      this.get("/activities", (schema, request) => {
        const { projeto_id } = request.queryParams;
        
        if (projeto_id) {
          return schema.activities.where({ projeto_id }).models;
        }
        
        return schema.activities.all();
      });

      this.post("/activities", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.activities.create({
          ...attrs,
          status: "PENDENTE",
          criado_em: new Date().toISOString()
        });
      });

      // ==========================================
      // TASKS
      // ==========================================
      this.get("/tasks", (schema, request) => {
        const { atividade_id } = request.queryParams;
        
        if (atividade_id) {
          return schema.tasks.where({ atividade_id }).models;
        }
        
        return schema.tasks.all();
      });

      this.post("/tasks", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.tasks.create({
          ...attrs,
          status: "PENDENTE",
          criado_em: new Date().toISOString()
        });
      });

      // ==========================================
      // DELIVERIES
      // ==========================================
      this.get("/deliveries", (schema, request) => {
        const { tarefa_id } = request.queryParams;
        
        if (tarefa_id) {
          return schema.deliveries.where({ tarefa_id }).models;
        }
        
        return schema.deliveries.all();
      });

      this.post("/deliveries", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.deliveries.create({
          ...attrs,
          status: "AGUARDANDO_APROVACAO",
          enviado_em: new Date().toISOString()
        });
      });

      this.patch("/deliveries/:id/approve", (schema, request) => {
        const id = request.params.id;
        const delivery = schema.deliveries.find(id);
        
        if (!delivery) {
          return new Response(404, {}, { message: "Entrega não encontrada" });
        }

        delivery.update({
          status: "APROVADA",
          aprovado_em: new Date().toISOString()
        });

        return delivery;
      });

      // ==========================================
      // CONTRATOS - Rotas importadas
      // ==========================================
      contractRoutes(this);

      // ==========================================
      // Passthrough para requisições não tratadas
      // ==========================================
      this.passthrough();
    },
  });
}