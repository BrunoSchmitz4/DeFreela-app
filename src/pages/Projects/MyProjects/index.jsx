// src/pages/Projects/MyProjects.jsx
import { useState } from "react";
import { useProjectsContext } from "../../../context/projectContext";
import ProjectCard from "../../../components/ProjectCard";
import CardList from "../../../components/CardList";
import styles from "./MyProjects.module.css";

function MyProjects() {
const { projects, loading, createProject, cancelProject, deleteProject } =
    useProjectsContext();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    value: "",
    deadline: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createProject({
      ...form,
      tags: ["React"], // mock
    });
    setForm({ title: "", description: "", value: "", deadline: "" });
    setShowModal(false);
  };

  if (loading) return <p>Carregando projetos...</p>;

  const projectCards = projects.map((p) => {
    return (
      <div key={p.id} className={styles.wrapperCardWithActions}>
        <ProjectCard project={p} />

        <div className={styles.cardActions}>
          {p.status === "ativo" && (
            <button onClick={() => cancelProject(p.id)}>Cancelar</button>
          )}

          {p.status === "cancelado" && (
            <button
              style={{ backgroundColor: "#ff5252" }}
              onClick={() => deleteProject(p.id)}
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Meus Projetos</h1>
        <button onClick={() => setShowModal(true)}>+ Novo Projeto</button>
      </header>

      {projects.length === 0 ? (
        <p>Nenhum projeto criado ainda.</p>
      ) : (
        <CardList renderItem={projectCards} />
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Novo Projeto</h2>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <input
                name="title"
                type="text"
                placeholder="Título do projeto"
                value={form.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descrição"
                value={form.description}
                onChange={handleChange}
                required
              />
              <input
                name="value"
                type="number"
                placeholder="Valor (R$)"
                value={form.value}
                onChange={handleChange}
                required
              />
              <input
                name="deadline"
                type="text"
                placeholder="Prazo (ex: 20 dias)"
                value={form.deadline}
                onChange={handleChange}
                required
              />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProjects;