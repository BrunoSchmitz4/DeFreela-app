import React, { useState } from "react";
import styles from "./CreateProjectModal.module.css";
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const newProject = {
      id: Date.now(),
      title,
      description,
      price: Number(price),
      status: "open",
    };

    onCreate(newProject);
    onClose();
    setTitle("");
    setDescription("");
    setPrice("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Criar Novo Projeto</h2>

        <label>Título</label>
        <Input
          placeholder="Ex: App de Controle Financeiro"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Descrição</label>
        <textarea
          className={styles.textarea}
          placeholder="Descreva brevemente o projeto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Valor (R$)</label>
        <Input
          type="number"
          placeholder="Ex: 1500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Criar Projeto
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
