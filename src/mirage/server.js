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

    // delay para UX mais real
    timing: 600,

    seeds(server) {
      // limpa absolutamente todo o estado anterior
      // Corrige problemas de hot reload mantendo sessão antiga
      server.db.emptyData();

      // Usuário inicial
      server.create("user", {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        bio: "Desenvolvedor full-stack entusiasta de projetos freelance.",
        skills: ["React", "Node.js", "CSS"],
        avatar: "https://i.pravatar.cc/150?img=3",
      });

      // Projetos de exemplo
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

      // Freelancers
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

      // Token inicial válido para o John
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

      // Helper para pegar token do header
      const getTokenFromRequest = (request) => {
        const auth = request.requestHeaders["Authorization"];
        if (auth && auth.startsWith("Bearer ")) {
          return auth.replace("Bearer ", "");
        }
        return request.queryParams.token || null;
      };

      // AUTH
      this.post("/auth/login", (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);

        const user = schema.users.findBy({ email: email?.toLowerCase() });
        if (!user || password !== "123456") {
          return new Response(401, {}, { error: "Credenciais inválidas." });
        }

        const token = `token_${Date.now()}_${Math.floor(
          Math.random() * 9999
        )}`;

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
          name,
          email,
          bio: "",
          skills: [],
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        });

        const token = `token_${Date.now()}_${Math.floor(
          Math.random() * 9999
        )}`;

        schema.tokens.create({ id: token, token, userId: newUser.id });

        return { data: newUser.attrs, token };
      });

      // /auth/me
      this.get("/auth/me", (schema, request) => {
        const token = getTokenFromRequest(request);

        // 🔥 Token inválido ou ausente
        if (!token || token === "undefined" || token === "null") {
          return new Response(401, {}, { error: "Token ausente." });
        }

        const record = schema.tokens.find(token);

        if (!record) {
          return new Response(401, {}, { error: "Token inválido ou expirado." });
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

      // PROJECTS
      this.get("/projects", (schema, request) => {
        const q = (request.queryParams.q || "").toLowerCase();

        let projects = schema.projects.all().models.map((m) => m.attrs);

        if (q) {
          projects = projects.filter(
            (p) =>
              p.title?.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.tags?.join(" ").toLowerCase().includes(q)
          );
        }

        return { data: projects };
      });

      this.get("/projects/:id", (schema, request) => {
        const id = request.params.id;
        const p = schema.projects.find(id);

        if (!p) return new Response(404, {}, { error: "Project não encontrado." });

        return { data: p.attrs };
      });

      this.post("/projects", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record)
          return new Response(401, {}, { error: "Não autorizado." });

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

        if (!record)
          return new Response(401, {}, { error: "Não autorizado." });

        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);

        const project = schema.projects.find(id);

        if (!project)
          return new Response(404, {}, { error: "Projeto não encontrado." });

        project.update(attrs);

        return { data: project.attrs };
      });

      this.delete("/projects/:id", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record)
          return new Response(401, {}, { error: "Não autorizado." });

        const id = request.params.id;
        const project = schema.projects.find(id);

        if (!project)
          return new Response(404, {}, { error: "Projeto não encontrado." });

        project.destroy();

        return new Response(204);
      });

      this.post("/projects/:id/interest", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record)
          return new Response(401, {}, { error: "Não autorizado." });

        const id = request.params.id;
        const { freelancerId } = JSON.parse(request.requestBody);

        const project = schema.projects.find(id);

        if (!project)
          return new Response(404, {}, { error: "Projeto não encontrado." });

        project.update({
          interested: [...(project.attrs.interested ?? []), freelancerId],
        });

        return { data: project.attrs };
      });

      this.delete("/projects/:id/interest/:freelancerId", (schema, request) => {
        const token = getTokenFromRequest(request);
        const record = schema.tokens.find(token);

        if (!record)
          return new Response(401, {}, { error: "Não autorizado." });

        const { id, freelancerId } = request.params;

        const project = schema.projects.find(id);

        if (!project)
          return new Response(404, {}, { error: "Projeto não encontrado." });

        project.update({
          interested: (project.attrs.interested ?? []).filter(
            (f) => String(f) !== String(freelancerId)
          ),
        });

        return { data: project.attrs };
      });

      // FREELANCERS
      this.get("/freelancers", (schema, request) => {
        const q = (request.queryParams.q || "").toLowerCase();

        let list = schema.freelancers.all().models.map((m) => m.attrs);

        if (q) {
          list = list.filter(
            (f) =>
              f.name?.toLowerCase().includes(q) ||
              f.bio?.toLowerCase().includes(q) ||
              f.skills?.join(" ").toLowerCase().includes(q)
          );
        }

        return { data: list };
      });

      this.get("/freelancers/:id", (schema, request) => {
        const id = request.params.id;
        const f = schema.freelancers.find(id);

        if (!f)
          return new Response(404, {}, { error: "Freelancer não encontrado." });

        return { data: f.attrs };
      });

      this.get("/freelancers/:id/jobs", (schema) => {
        const id = schema.requestParams?.id;

        const projects = schema.projects
          .all()
          .models.map((m) => m.attrs)
          .filter((p) => String(p.assignedFreelancer) === String(id));

        return { data: projects };
      });

      // fallback
      this.passthrough();
    },
  });
}
