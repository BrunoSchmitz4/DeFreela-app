import { useState } from "react";
import styles from "./Projects.module.css";

function CreateProjectModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      value,
      deadline,
      tags: ["React"], // mock
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Novo Projeto</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <input
            type="text"
            placeholder="Título do projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Valor (R$)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Prazo (ex: 20 dias)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
