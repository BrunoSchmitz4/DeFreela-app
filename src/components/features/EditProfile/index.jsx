import { useState } from "react";
import Modal from "../../ui/Modal";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import styles from "./EditProfileModal.module.css";

export default function EditProfileModal({ isOpen, onClose, profileData, onSave }) {
  const [form, setForm] = useState({
    nome_completo: profileData?.nome_completo || "",
    bio: profileData?.bio || "",
    habilidades: profileData?.habilidades || "",
    valor_hora: profileData?.valor_hora || "",
    portfolio_url: profileData?.portfolio_url || "",
    telefone: profileData?.telefone || "",
    endereco: profileData?.endereco || ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erro do campo ao editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nome_completo?.trim()) {
      newErrors.nome_completo = "Nome completo é obrigatório";
    }

    if (form.valor_hora && parseFloat(form.valor_hora) < 0) {
      newErrors.valor_hora = "Valor/hora deve ser positivo";
    }

    if (form.portfolio_url && !form.portfolio_url.startsWith('http')) {
      newErrors.portfolio_url = "URL do portfólio deve começar com http:// ou https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // Converte habilidades em array se for string
      const dataToSave = {
        ...form,
        valor_hora: form.valor_hora ? parseFloat(form.valor_hora) : null
      };

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil">
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Nome Completo */}
        <div className={styles.formGroup}>
          <label htmlFor="nome_completo">Nome Completo *</label>
          <Input
            id="nome_completo"
            name="nome_completo"
            value={form.nome_completo}
            onChange={handleChange}
            placeholder="Seu nome completo"
            error={errors.nome_completo}
          />
          {errors.nome_completo && (
            <span className={styles.error}>{errors.nome_completo}</span>
          )}
        </div>

        {/* Bio */}
        <div className={styles.formGroup}>
          <label htmlFor="bio">Biografia</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Conte um pouco sobre você e sua experiência..."
            className={styles.textarea}
            rows="4"
          />
        </div>

        {/* Habilidades */}
        <div className={styles.formGroup}>
          <label htmlFor="habilidades">Habilidades</label>
          <Input
            id="habilidades"
            name="habilidades"
            value={form.habilidades}
            onChange={handleChange}
            placeholder="Ex: React, Node.js, TypeScript (separadas por vírgula)"
          />
          <small className={styles.hint}>
            Separe as habilidades por vírgula
          </small>
        </div>

        {/* Valor/Hora */}
        <div className={styles.formGroup}>
          <label htmlFor="valor_hora">Valor por Hora (R$)</label>
          <Input
            id="valor_hora"
            name="valor_hora"
            type="number"
            step="0.01"
            value={form.valor_hora}
            onChange={handleChange}
            placeholder="0.00"
            error={errors.valor_hora}
          />
          {errors.valor_hora && (
            <span className={styles.error}>{errors.valor_hora}</span>
          )}
        </div>

        {/* Portfolio URL */}
        <div className={styles.formGroup}>
          <label htmlFor="portfolio_url">URL do Portfólio</label>
          <Input
            id="portfolio_url"
            name="portfolio_url"
            type="url"
            value={form.portfolio_url}
            onChange={handleChange}
            placeholder="https://seu-portfolio.com"
            error={errors.portfolio_url}
          />
          {errors.portfolio_url && (
            <span className={styles.error}>{errors.portfolio_url}</span>
          )}
        </div>

        {/* Telefone */}
        <div className={styles.formGroup}>
          <label htmlFor="telefone">Telefone</label>
          <Input
            id="telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* Endereço */}
        <div className={styles.formGroup}>
          <label htmlFor="endereco">Endereço</label>
          <Input
            id="endereco"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Cidade, Estado"
          />
        </div>

        {/* Botões */}
        <div className={styles.buttons}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}