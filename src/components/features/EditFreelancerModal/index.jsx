import { useState, useEffect } from "react";
import Modal from "../../../ui/Modal";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import { FreelancerRepository } from "../../../../repos/FreelancerRepository";
import styles from "./FreelancerModals.module.css";

export default function EditFreelancerModal({ isOpen, freelancer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    cpf_cnpj: "",
    is_pj: false,
    habilidades: "",
    valor_hora: "",
    portfolio_url: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // UC01 - Preencher formulário quando freelancer mudar
  useEffect(() => {
    if (freelancer) {
      setFormData({
        nome_completo: freelancer.nome_completo || "",
        email: freelancer.email || "",
        cpf_cnpj: freelancer.cpf_cnpj || "",
        is_pj: freelancer.is_pj || false,
        habilidades: freelancer.habilidades || "",
        valor_hora: freelancer.valor_hora?.toString() || "",
        portfolio_url: freelancer.portfolio_url || ""
      });
    }
  }, [freelancer]);

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }

  // UC01 - Validar formulário
  function validate() {
    const newErrors = {};

    if (!formData.nome_completo.trim()) {
      newErrors.nome_completo = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.valor_hora || parseFloat(formData.valor_hora) <= 0) {
      newErrors.valor_hora = "Valor/hora deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // UC01 - Submeter edição
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        nome_completo: formData.nome_completo,
        email: formData.email,
        habilidades: formData.habilidades.trim(),
        valor_hora: parseFloat(formData.valor_hora),
        portfolio_url: formData.portfolio_url
        // CPF/CNPJ e tipo PJ/PF não são editáveis após criação
      };

      await FreelancerRepository.update(freelancer.id, payload);
      alert("Freelancer atualizado com sucesso!");
      onSuccess();
    } catch (err) {
      console.error("Erro ao atualizar freelancer:", err);
      alert("Erro ao atualizar freelancer. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !freelancer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Freelancer"
      size="large"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Nome Completo */}
        <div className={styles.formGroup}>
          <label htmlFor="edit_nome_completo">
            Nome Completo <span className={styles.required}>*</span>
          </label>
          <Input
            id="edit_nome_completo"
            value={formData.nome_completo}
            onChange={(e) => handleChange("nome_completo", e.target.value)}
            error={errors.nome_completo}
          />
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="edit_email">
            Email <span className={styles.required}>*</span>
          </label>
          <Input
            id="edit_email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />
        </div>

        {/* Tipo e CPF/CNPJ (somente leitura) */}
        <div className={styles.formGroup}>
          <label>Tipo</label>
          <div className={styles.readOnlyField}>
            {formData.is_pj ? "Pessoa Jurídica (PJ)" : "Pessoa Física (PF)"}
          </div>
          <small className={styles.hint}>
            Tipo não pode ser alterado após cadastro
          </small>
        </div>

        <div className={styles.formGroup}>
          <label>{formData.is_pj ? "CNPJ" : "CPF"}</label>
          <div className={styles.readOnlyField}>
            {formData.cpf_cnpj}
          </div>
          <small className={styles.hint}>
            {formData.is_pj ? "CNPJ" : "CPF"} não pode ser alterado após cadastro
          </small>
        </div>

        {/* Valor/Hora */}
        <div className={styles.formGroup}>
          <label htmlFor="edit_valor_hora">
            Valor/Hora (R$) <span className={styles.required}>*</span>
          </label>
          <Input
            id="edit_valor_hora"
            type="number"
            step="0.01"
            min="0"
            value={formData.valor_hora}
            onChange={(e) => handleChange("valor_hora", e.target.value)}
            error={errors.valor_hora}
          />
        </div>

        {/* Habilidades */}
        <div className={styles.formGroup}>
          <label htmlFor="edit_habilidades">Habilidades</label>
          <textarea
            id="edit_habilidades"
            className={styles.textarea}
            value={formData.habilidades}
            onChange={(e) => handleChange("habilidades", e.target.value)}
            placeholder="Ex: React, Node.js, Design UX/UI"
            rows={3}
          />
          <small className={styles.hint}>
            Separe as habilidades por vírgula
          </small>
        </div>

        {/* Portfólio URL */}
        <div className={styles.formGroup}>
          <label htmlFor="edit_portfolio_url">Link do Portfólio</label>
          <Input
            id="edit_portfolio_url"
            type="url"
            value={formData.portfolio_url}
            onChange={(e) => handleChange("portfolio_url", e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Botões */}
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}