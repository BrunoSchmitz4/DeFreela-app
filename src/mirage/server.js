// src/mirage/server.js
import { createServer, Model, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      user: Model,
      project: Model,
      freelancer: Model,
      token: Model,
    },

    timing: 600, // delay padrão das respostas

    seeds(server) {
      // PERSISTÊNCIA REAL DO TOKEN (correção do bug de sessão)
      const storedToken = window.localStorage.getItem("token");

      if (storedToken) {
        // Recria o token dentro do Mirage (para sobreviver ao reload)
        server.create("token", {
          id: storedToken,
          token: storedToken,
          userId: 1,
        });
      }

      // Se não existe token, cria um token inicial e sincroniza com o localStorage
      if (!storedToken) {
        const initialToken = `token_${Date.now()}_initial`;

        server.create("token", {
          id: initialToken,
          token: initialToken,
          userId: 1,
        });

        window.localStorage.setItem("token", initialToken);
      }

      // SEED DO USUÁRIO PADRÃO
      server.create("user", {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        bio: "Desenvolvedor full-stack entusiasta de projetos freelance.",
        skills: ["React", "Node.js", "CSS"],
        avatar: "https://i.pravatar.cc/150?img=3",
      });

      // PROJETOS DE EXEMPLO
      server.create("project", {
        id: 11,
        title: "Landing Page para startup",
        description: "Criar landing page responsiva com formulário de contato.",
        ownerId: 1,
        budget: 800,
        status: "active",
        tags: ["React", "HTML", "CSS"],
        interested: [],
        assignedFreelancer: null,
      });

      server.create("project", {
        id: 12,
        title: "Mini-jogo em Unity",
        description: "Protótipo de jogo 2D com mecânicas de plataforma.",
        ownerId: 1,
        budget: 1500,
        status: "active",
        tags: ["Unity", "C#"],
        interested: [],
        assignedFreelancer: null,
      });

      // FREELANCERS DE EXEMPLO
      server.create("freelancer", {
        id: 101,
        name: "Ana Lima",
        email: "ana@example.com",
        bio: "Frontend dev especializada em React.",
        skills: ["React", "TypeScript", "CSS"],
        avatar: "https://i.pravatar.cc/150?img=5",
      });

      server.create("freelancer", {
        id: 102,
        name: "Carlos Silva",
        email: "carlos@example.com",
        bio: "Game dev com foco em Unity.",
        skills: ["Unity", "C#", "Shader"],
        avatar: "https://i.pravatar.cc/150?img=6",
      });
    },

    routes() {
      this.namespace = "api";
      this.timing = 600;

      // Utilitário para extrair token do header
      const getTokenFromRequest = (request) => {
        const auth = request.requestHeaders["Authorization"];
        if (auth && auth.startsWith("Bearer ")) {
          return auth.replace("Bearer ", "");
        }
        return request.queryParams.token || null;
      };

      // 🔐 AUTH
      this.post("/auth/login", (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);

        const user = schema.users.findBy({ email: email?.toLowerCase() });

        if (!user || password !== "123456") {
          return new Response(401, {}, { error: "Credenciais inválidas." });
        }

        const token = `token_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
        schema.tokens.create({ id: token, token, userId: user.id });

        // Persistência do token no navegador
        window.localStorage.setItem("token", token);

        return { data: user.attrs, token };
      });

      this.post("/auth/register", (schema, request) => {
        const { name, email, password } = JSON.parse(request.requestBody);

        if (schema.users.findBy({ email: email?.toLowerCase() })) {
          return new Response(409, {}, { error: "Email já cadastrado!" });
        }

        const newUser = schema.users.create({
          id: Date.now(),
          name,
          email,
          bio: "",
          skills: [],
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        });

        const token = `token_${Date.now()}_${Math.floor(Math.random() * 9999)}`;

        schema.tokens.create({ id: token, token, userId: newUser.id });

        window.localStorage.setItem("token", token);

        return { data: newUser.attrs, token };
      });

      this.get("/auth/me", (schema, request) => {
        const token = getTokenFromRequest(request);
        if (!token) return new Response(401, {}, { error: "Token ausente." });

        const record = schema.tokens.find(token);
        if (!record) return new Response(401, {}, { error: "Token inválido ou expirado." });

        const user = schema.users.find(record.userId);
        if (!user) return new Response(404, {}, { error: "Usuário não encontrado." });

        return { data: user.attrs };
      });

      this.post("/auth/logout", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (record) record.destroy();

        // remover token do navegador também
        window.localStorage.removeItem("token");

        return { success: true };
      });

      // 📁 PROJECTS (CRUD + interest)
      this.get("/projects", (schema, request) => {
        const q = (request.queryParams.q || "").toLowerCase();
        let projects = schema.projects.all().models.map((m) => m.attrs);

        if (q.length > 0) {
          projects = projects.filter((p) =>
            [p.title, p.description, p.tags?.join(" ")]
              .filter(Boolean)
              .some((val) => val.toLowerCase().includes(q))
          );
        }

        return { data: projects };
      });

      this.get("/projects/:id", (schema, request) => {
        const project = schema.projects.find(request.params.id);
        if (!project) return new Response(404, {}, { error: "Projeto não encontrado." });

        return { data: project.attrs };
      });

      this.post("/projects", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) return new Response(401, {}, { error: "Não autorizado." });

        const attrs = JSON.parse(request.requestBody);

        const newProject = schema.projects.create({
          id: Date.now(),
          ...attrs,
          ownerId: record.userId,
          status: "active",
          interested: [],
          assignedFreelancer: null,
        });

        return { data: newProject.attrs };
      });

      this.patch("/projects/:id", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) return new Response(401, {}, { error: "Não autorizado." });

        const project = schema.projects.find(request.params.id);
        if (!project) return new Response(404, {}, { error: "Projeto não encontrado." });

        project.update(JSON.parse(request.requestBody));
        return { data: project.attrs };
      });

      this.delete("/projects/:id", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) return new Response(401, {}, { error: "Não autorizado." });

        const project = schema.projects.find(request.params.id);

        if (!project) return new Response(404, {}, { error: "Projeto não encontrado." });

        project.destroy();
        return new Response(204);
      });

      // INTEREST
      this.post("/projects/:id/interest", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) return new Response(401, {}, { error: "Não autorizado." });

        const project = schema.projects.find(request.params.id);
        if (!project) return new Response(404, {}, { error: "Projeto não encontrado." });

        const { freelancerId } = JSON.parse(request.requestBody);

        project.update({
          interested: [...project.attrs.interested, freelancerId],
        });

        return { data: project.attrs };
      });

      this.delete("/projects/:id/interest/:freelancerId", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record) return new Response(401, {}, { error: "Não autorizado." });

        const { id, freelancerId } = request.params;

        const project = schema.projects.find(id);
        if (!project) return new Response(404, {}, { error: "Projeto não encontrado." });

        project.update({
          interested: project.attrs.interested.filter(
            (f) => String(f) !== String(freelancerId)
          ),
        });

        return { data: project.attrs };
      });

      // 👤 FREELANCERS
      this.get("/freelancers", (schema, request) => {
        const q = (request.queryParams.q || "").toLowerCase();

        let list = schema.freelancers.all().models.map((m) => m.attrs);

        if (q.length > 0) {
          list = list.filter(
            (f) =>
              f.name.toLowerCase().includes(q) ||
              f.bio.toLowerCase().includes(q) ||
              f.skills.join(" ").toLowerCase().includes(q)
          );
        }

        return { data: list };
      });

      this.get("/freelancers/:id", (schema, request) => {
        const f = schema.freelancers.find(request.params.id);
        if (!f) return new Response(404, {}, { error: "Freelancer não encontrado." });

        return { data: f.attrs };
      });

      this.get("/freelancers/:id/jobs", (schema, request) => {
        const id = request.params.id;

        const jobs = schema.projects
          .all()
          .models.map((m) => m.attrs)
          .filter((p) => String(p.assignedFreelancer) === String(id));

        return { data: jobs };
      });

      this.passthrough();
    },
  });
}
