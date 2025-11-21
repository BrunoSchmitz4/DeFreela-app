import { createServer, Model, Response } from "miragejs";

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

      // Freelancer 1
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

      // Freelancer 2
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

      // Freelancer 3
      server.create("user", {
        id: 4,
        email: "pedro.redator@teste.com",
        tipo_usuario: "FREELANCER",
        nome_completo: "Pedro Oliveira",
        cpf_cnpj: "98765432109",
        is_pj: false,
        habilidades: "Copywriting, SEO, Marketing de Conteúdo",
        valor_hora: 60.00,
        portfolio_url: "https://medium.com/@pedro",
        avatar: "https://i.pravatar.cc/150?img=7",
        criado_em: "2025-01-08T11:00:00Z"
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
        freelancers_atribuidos: [2, 3], // IDs dos freelancers
        empresa: {
          id: 1,
          nome_empresa: "Tech Solutions Ltda"
        }
      });

      server.create("project", {
        id: 2,
        empresa_id: 1,
        titulo: "Desenvolvimento de App Mobile",
        descricao: "Aplicativo para gestão de vendas em campo",
        orcamento_total: 45000.00,
        data_inicio: "2025-02-01",
        data_fim_prevista: "2025-06-30",
        status: "PLANEJAMENTO",
        criado_em: "2025-01-20T10:00:00Z",
        freelancers_atribuidos: [3],
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

      server.create("activity", {
        id: 2,
        projeto_id: 1,
        nome: "Design de Interface",
        descricao: "Criação de wireframes e protótipos de alta fidelidade",
        ordem: 2,
        status: "EM_ANDAMENTO",
        criado_em: "2025-01-15T09:05:00Z"
      });

      server.create("activity", {
        id: 3,
        projeto_id: 1,
        nome: "Desenvolvimento Frontend",
        descricao: "Implementação do design em código React",
        ordem: 3,
        status: "PENDENTE",
        criado_em: "2025-01-15T09:10:00Z"
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

      server.create("task", {
        id: 2,
        atividade_id: 2,
        freelancer_id: 2,
        titulo: "Wireframes Desktop",
        descricao: "Criar wireframes de todas as páginas para desktop",
        prioridade: "ALTA",
        prazo: "2025-02-05",
        valor: 1500.00,
        status: "APROVADA",
        criado_em: "2025-01-28T09:00:00Z"
      });

      server.create("task", {
        id: 3,
        atividade_id: 2,
        freelancer_id: 2,
        titulo: "Wireframes Mobile",
        descricao: "Criar wireframes responsivos para mobile",
        prioridade: "ALTA",
        prazo: "2025-02-10",
        valor: 1200.00,
        status: "ENTREGA_RECEBIDA",
        criado_em: "2025-02-01T10:00:00Z"
      });

      server.create("task", {
        id: 4,
        atividade_id: 2,
        freelancer_id: 2,
        titulo: "Protótipo Interativo",
        descricao: "Desenvolver protótipo clicável no Figma",
        prioridade: "URGENTE",
        prazo: "2025-02-15",
        valor: 1900.00,
        status: "EM_PROGRESSO",
        criado_em: "2025-02-05T11:00:00Z"
      });

      // ==========================================
      // ENTREGAS
      // ==========================================
      
      server.create("delivery", {
        id: 1,
        tarefa_id: 1,
        arquivo_url: "/uploads/analise-concorrentes.pdf",
        observacoes: "Análise completa com insights acionáveis",
        status: "APROVADA",
        enviado_em: "2025-01-19T14:30:00Z",
        aprovado_em: "2025-01-20T09:15:00Z",
        aprovado_por: 1
      });

      server.create("delivery", {
        id: 2,
        tarefa_id: 2,
        arquivo_url: "/uploads/wireframes-desktop-v2.fig",
        observacoes: "Wireframes ajustados conforme feedback",
        status: "APROVADA",
        enviado_em: "2025-02-05T15:30:00Z",
        aprovado_em: "2025-02-05T18:00:00Z",
        aprovado_por: 1
      });

      server.create("delivery", {
        id: 3,
        tarefa_id: 3,
        arquivo_url: "/uploads/wireframes-mobile.fig",
        observacoes: "Wireframes mobile responsivos",
        status: "AGUARDANDO_APROVACAO",
        enviado_em: "2025-02-09T17:00:00Z"
      });

      // ==========================================
      // PAGAMENTOS
      // ==========================================
      
      server.create("payment", {
        id: 1,
        tarefa_id: 1,
        freelancer_id: 2,
        valor: 800.00,
        data_pagamento: "2025-01-25",
        metodo_pagamento: "PIX",
        status: "PAGO",
        observacoes: "Pagamento pela análise de concorrentes",
        criado_em: "2025-01-25T10:00:00Z"
      });

      server.create("payment", {
        id: 2,
        tarefa_id: 2,
        freelancer_id: 2,
        valor: 1500.00,
        data_pagamento: "2025-02-06",
        metodo_pagamento: "TRANSFERENCIA",
        status: "PAGO",
        observacoes: "Pagamento pelos wireframes desktop",
        criado_em: "2025-02-06T11:00:00Z"
      });

      // ==========================================
      // COMENTÁRIOS
      // ==========================================
      
      server.create("comment", {
        id: 1,
        autor_id: 1,
        tarefa_id: 2,
        conteudo: "Wireframes ficaram excelentes! Aprovado.",
        criado_em: "2025-02-05T18:00:00Z"
      });

      server.create("comment", {
        id: 2,
        autor_id: 2,
        tarefa_id: 2,
        conteudo: "Obrigado! Qualquer ajuste é só avisar.",
        criado_em: "2025-02-05T18:30:00Z"
      });

      // ==========================================
      // NOTIFICAÇÕES
      // ==========================================
      
      server.create("notification", {
        id: 1,
        usuario_id: 1,
        tipo: "ENTREGA_RECEBIDA",
        titulo: "Nova Entrega Recebida",
        mensagem: "João Silva enviou os wireframes mobile para aprovação",
        lida: false,
        link_referencia: "/tasks/3",
        criado_em: "2025-02-09T17:00:00Z"
      });

      server.create("notification", {
        id: 2,
        usuario_id: 2,
        tipo: "ENTREGA_APROVADA",
        titulo: "Entrega Aprovada",
        mensagem: "Sua entrega dos wireframes desktop foi aprovada!",
        lida: true,
        link_referencia: "/tasks/2",
        criado_em: "2025-02-05T18:00:00Z"
      });

      server.create("notification", {
        id: 3,
        usuario_id: 2,
        tipo: "PAGAMENTO_EFETUADO",
        titulo: "Pagamento Realizado",
        mensagem: "Pagamento de R$ 1.500,00 foi efetuado",
        lida: true,
        link_referencia: "/payments",
        criado_em: "2025-02-06T11:00:00Z"
      });

      // Token inicial
      const fakeToken = `token_${Date.now()}_initial`;
      server.create("token", {
        id: fakeToken,
        token: fakeToken,
        userId: 1,
      });
    },

    routes() {
      this.namespace = "api";
      this.timing = 600;

      const getTokenFromRequest = (request) => {
        const auth = request.requestHeaders["Authorization"];
        if (auth && auth.startsWith("Bearer ")) {
          return auth.replace("Bearer ", "");
        }
        return request.queryParams.token || null;
      };

      // ==========================================
      // AUTH
      // ==========================================
      
      this.post("/auth/login", (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email: email?.toLowerCase() });

        if (!user || password !== "123456") {
          return new Response(401, {}, { error: "Credenciais inválidas." });
        }

        const token = `token_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
        schema.tokens.create({ id: token, token, userId: user.id });

        return { data: user.attrs, token };
      });

      this.post("/auth/register", (schema, request) => {
        const { name, email, password } = JSON.parse(request.requestBody);

        if (schema.users.findBy({ email: email?.toLowerCase() })) {
          return new Response(409, {}, { error: "Email já cadastrado!" });
        }

        const newUser = schema.users.create({
          id: Date.now(),
          email,
          tipo_usuario: "FREELANCER",
          nome_completo: name,
          cpf_cnpj: "",
          is_pj: false,
          habilidades: "",
          valor_hora: 0,
          portfolio_url: "",
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
          criado_em: new Date().toISOString()
        });

        const token = `token_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
        schema.tokens.create({ id: token, token, userId: newUser.id });

        return { data: newUser.attrs, token };
      });

      this.get("/auth/me", (schema, request) => {
        const token = getTokenFromRequest(request);

        if (!token || token === "undefined" || token === "null") {
          return new Response(401, {}, { error: "Token ausente." });
        }

        const record = schema.tokens.find(token);
        if (!record) {
          return new Response(401, {}, { error: "Token inválido." });
        }

        const user = schema.users.find(record.userId);
        if (!user) {
          return new Response(404, {}, { error: "Usuário não encontrado." });
        }

        return { data: user.attrs };
      });

      this.post("/auth/logout", (schema, request) => {
        const token = getTokenFromRequest(request);
        if (token) {
          const record = schema.tokens.find(token);
          if (record) record.destroy();
        }
        return { success: true };
      });

      // ==========================================
      // PROJECTS
      // ==========================================
      
      this.get("/projects", (schema, request) => {
        const q = (request.queryParams.q || "").toLowerCase();
        let projects = schema.projects.all().models.map((m) => m.attrs);

        if (q) {
          projects = projects.filter(
            (p) =>
              p.titulo?.toLowerCase().includes(q) ||
              p.descricao?.toLowerCase().includes(q)
          );
        }

        return { data: projects };
      });

      this.get("/projects/:id", (schema, request) => {
        const id = request.params.id;
        const project = schema.projects.find(id);

        if (!project) {
          return new Response(404, {}, { error: "Projeto não encontrado." });
        }

        return { data: project.attrs };
      });

      this.post("/projects", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) {
          return new Response(401, {}, { error: "Não autorizado." });
        }

        const attrs = JSON.parse(request.requestBody);

        const newProject = schema.projects.create({
          id: Date.now(),
          ...attrs,
          empresa_id: record.userId,
          status: "PLANEJAMENTO",
          freelancers_atribuidos: [],
          criado_em: new Date().toISOString()
        });

        return { data: newProject.attrs };
      });

      this.patch("/projects/:id", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) {
          return new Response(401, {}, { error: "Não autorizado." });
        }

        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const project = schema.projects.find(id);

        if (!project) {
          return new Response(404, {}, { error: "Projeto não encontrado." });
        }

        project.update(attrs);
        return { data: project.attrs };
      });

      this.delete("/projects/:id", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) {
          return new Response(401, {}, { error: "Não autorizado." });
        }

        const id = request.params.id;
        const project = schema.projects.find(id);

        if (!project) {
          return new Response(404, {}, { error: "Projeto não encontrado." });
        }

        project.destroy();
        return new Response(204);
      });

      // ==========================================
      // ACTIVITIES
      // ==========================================
      
      this.get("/projects/:projectId/activities", (schema, request) => {
        const projectId = request.params.projectId;
        const activities = schema.activities
          .all()
          .models.map((m) => m.attrs)
          .filter((a) => String(a.projeto_id) === String(projectId))
          .sort((a, b) => a.ordem - b.ordem);

        return { data: activities };
      });

      this.post("/projects/:projectId/activities", (schema, request) => {
        const projectId = request.params.projectId;
        const attrs = JSON.parse(request.requestBody);

        const newActivity = schema.activities.create({
          id: Date.now(),
          projeto_id: Number(projectId),
          ...attrs,
          status: "PENDENTE",
          criado_em: new Date().toISOString()
        });

        return { data: newActivity.attrs };
      });

      this.patch("/activities/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const activity = schema.activities.find(id);

        if (!activity) {
          return new Response(404, {}, { error: "Atividade não encontrada." });
        }

        activity.update(attrs);
        return { data: activity.attrs };
      });

      // ==========================================
      // TASKS
      // ==========================================
      
      this.get("/activities/:activityId/tasks", (schema, request) => {
        const activityId = request.params.activityId;
        const tasks = schema.tasks
          .all()
          .models.map((m) => m.attrs)
          .filter((t) => String(t.atividade_id) === String(activityId));

        return { data: tasks };
      });

      this.post("/activities/:activityId/tasks", (schema, request) => {
        const activityId = request.params.activityId;
        const attrs = JSON.parse(request.requestBody);

        const newTask = schema.tasks.create({
          id: Date.now(),
          atividade_id: Number(activityId),
          ...attrs,
          status: "PENDENTE",
          criado_em: new Date().toISOString()
        });

        return { data: newTask.attrs };
      });

      this.patch("/tasks/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const task = schema.tasks.find(id);

        if (!task) {
          return new Response(404, {}, { error: "Tarefa não encontrada." });
        }

        task.update(attrs);
        return { data: task.attrs };
      });

      // ==========================================
      // DELIVERIES
      // ==========================================
      
      this.get("/tasks/:taskId/deliveries", (schema, request) => {
        const taskId = request.params.taskId;
        const deliveries = schema.deliveries
          .all()
          .models.map((m) => m.attrs)
          .filter((d) => String(d.tarefa_id) === String(taskId));

        return { data: deliveries };
      });

      this.post("/tasks/:taskId/deliveries", (schema, request) => {
        const taskId = request.params.taskId;
        const attrs = JSON.parse(request.requestBody);

        const newDelivery = schema.deliveries.create({
          id: Date.now(),
          tarefa_id: Number(taskId),
          ...attrs,
          status: "AGUARDANDO_APROVACAO",
          enviado_em: new Date().toISOString()
        });

        return { data: newDelivery.attrs };
      });

      this.patch("/deliveries/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const delivery = schema.deliveries.find(id);

        if (!delivery) {
          return new Response(404, {}, { error: "Entrega não encontrada." });
        }

        delivery.update(attrs);
        return { data: delivery.attrs };
      });

      // ==========================================
      // PAYMENTS
      // ==========================================
      
      this.get("/payments", (schema, request) => {
        const freelancerId = request.queryParams.freelancer_id;
        let payments = schema.payments.all().models.map((m) => m.attrs);

        if (freelancerId) {
          payments = payments.filter(
            (p) => String(p.freelancer_id) === String(freelancerId)
          );
        }

        return { data: payments };
      });

      this.post("/payments", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        const newPayment = schema.payments.create({
          id: Date.now(),
          ...attrs,
          status: "PENDENTE",
          criado_em: new Date().toISOString()
        });

        return { data: newPayment.attrs };
      });

      // ==========================================
      // COMMENTS
      // ==========================================
      
      this.get("/tasks/:taskId/comments", (schema, request) => {
        const taskId = request.params.taskId;
        const comments = schema.comments
          .all()
          .models.map((m) => m.attrs)
          .filter((c) => String(c.tarefa_id) === String(taskId));

        return { data: comments };
      });

      this.post("/tasks/:taskId/comments", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) {
          return new Response(401, {}, { error: "Não autorizado." });
        }

        const taskId = request.params.taskId;
        const attrs = JSON.parse(request.requestBody);

        const newComment = schema.comments.create({
          id: Date.now(),
          tarefa_id: Number(taskId),
          autor_id: record.userId,
          ...attrs,
          criado_em: new Date().toISOString()
        });

        return { data: newComment.attrs };
      });

      // ==========================================
      // NOTIFICATIONS
      // ==========================================
      
      this.get("/notifications", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) {
          return new Response(401, {}, { error: "Não autorizado." });
        }

        const notifications = schema.notifications
          .all()
          .models.map((m) => m.attrs)
          .filter((n) => String(n.usuario_id) === String(record.userId))
          .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

        return { data: notifications };
      });

      this.patch("/notifications/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const notification = schema.notifications.find(id);

        if (!notification) {
          return new Response(404, {}, { error: "Notificação não encontrada." });
        }

        notification.update(attrs);
        return { data: notification.attrs };
      });

      // ==========================================
      // FREELANCERS
      // ==========================================
      
      this.get("/freelancers", (schema, request) => {
        const q = (request.queryParams.q || "").toLowerCase();
        let freelancers = schema.users
          .all()
          .models.map((m) => m.attrs)
          .filter((u) => u.tipo_usuario === "FREELANCER");

        if (q) {
          freelancers = freelancers.filter(
            (f) =>
              f.nome_completo?.toLowerCase().includes(q) ||
              f.habilidades?.toLowerCase().includes(q)
          );
        }

        return { data: freelancers };
      });

      this.get("/freelancers/:id", (schema, request) => {
        const id = request.params.id;
        const freelancer = schema.users.find(id);

        if (!freelancer || freelancer.attrs.tipo_usuario !== "FREELANCER") {
          return new Response(404, {}, { error: "Freelancer não encontrado." });
        }

        return { data: freelancer.attrs };
      });

      this.get("/freelancers/:id/jobs", (schema, request) => {
        const id = request.params.id;
        
        const projects = schema.projects
          .all()
          .models.map((m) => m.attrs)
          .filter((p) => p.freelancers_atribuidos?.includes(Number(id)));

        return { data: projects };
      });

      this.passthrough();
    },
  });
}