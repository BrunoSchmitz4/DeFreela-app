import { useState, useEffect } from "react";
import Modal from "../../../ui/Modal";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import styles from "./CreateProjectModal.module.css";

// Importações de utilitários
import { validators } from "../../../../utils/validators";
import { formatDateForInput } from "../../../../utils/formatters";
import { MENSAGENS } from "../../../../utils/constants";

// Importações de services
import { ProjectRepository } from "../../../../repos/ProjectRepository";
import { FreelancerRepository } from "../../../../repos/FreelancerRepository";

export default function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    orcamento_total: "",
    data_inicio: "",
    data_fim_prevista: ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hasFreelancers, setHasFreelancers] = useState(true);
  const [checkingFreelancers, setCheckingFreelancers] = useState(false);

  // UC02 - Verificar se tem freelancers cadastrados
  useEffect(() => {
    async function checkFreelancers() {
      if (!isOpen) return;

      setCheckingFreelancers(true);
      try {
        const freelancers = await FreelancerRepository.search("");
        setHasFreelancers(freelancers.length > 0);
      } catch (err) {
        console.error("Erro ao verificar freelancers:", err);
        setHasFreelancers(false);
      } finally {
        setCheckingFreelancers(false);
      }
    }

    checkFreelancers();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // UC02 - Validações do formulário
  const validateForm = () => {
    const newErrors = {};

    // Título obrigatório
    const tituloTrimmed = form.titulo.trim();
    
    if (!tituloTrimmed) {
      newErrors.titulo = "Título é obrigatório";
    } else if (tituloTrimmed.length < 5) {
      newErrors.titulo = "Título deve ter no mínimo 5 caracteres";
    } else if (tituloTrimmed.length > 255) {
      newErrors.titulo = "Título deve ter no máximo 255 caracteres";
    }

    // Descrição obrigatória
    const descricaoTrimmed = form.descricao.trim();
    
    if (!descricaoTrimmed) {
      newErrors.descricao = "Descrição é obrigatória";
    } else if (descricaoTrimmed.length < 20) {
      newErrors.descricao = "Descrição deve ter no mínimo 20 caracteres";
    }

    // Orçamento (opcional mas se preenchido deve ser válido)
    if (form.orcamento_total) {
      if (!validators.positiveNumber(form.orcamento_total).valid) {
        newErrors.orcamento_total = "Orçamento deve ser maior que zero";
      }
    }

    // Data de início (opcional mas se preenchido deve ser válido)
    if (form.data_inicio) {
      const dataInicio = new Date(form.data_inicio);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataInicio < hoje) {
        newErrors.data_inicio = "Data de início não pode ser no passado";
      }
    }

    // Data de fim (obrigatória se data de início foi preenchida)
    if (form.data_inicio && !form.data_fim_prevista) {
      newErrors.data_fim_prevista = "Informe a data de término prevista";
    }

    // Validar que data de fim > data de início
    if (form.data_inicio && form.data_fim_prevista) {
      const inicio = new Date(form.data_inicio);
      const fim = new Date(form.data_fim_prevista);

      if (fim <= inicio) {
        newErrors.data_fim_prevista = "Data de término deve ser posterior à data de início";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // UC02 - Validar formulário
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // UC02 - Criar projeto
      const payload = {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        orcamento_total: form.orcamento_total ? parseFloat(form.orcamento_total) : null,
        data_inicio: form.data_inicio || null,
        data_fim_prevista: form.data_fim_prevista || null,
        status: "PLANEJAMENTO"
      };

      const newProject = await ProjectRepository.create(payload);

      alert(MENSAGENS.SUCESSO.PROJETO_CRIADO);
      
      // Callback de sucesso
      onCreate && onCreate(newProject);
      
      // Limpa formulário e fecha modal
      handleClose();
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
      
      // Trata erros de validação do backend
      if (err.message) {
        alert(err.message);
      } else {
        alert("Erro ao criar projeto. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      titulo: "",
      descricao: "",
      orcamento_total: "",
      data_inicio: "",
      data_fim_prevista: ""
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Criar Novo Projeto">
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* UC02 - Aviso se não houver freelancers */}
        {checkingFreelancers ? (
          <div className={styles.infoBox}>
            <p>Verificando freelancers disponíveis...</p>
          </div>
        ) : !hasFreelancers ? (
          <div className={styles.warningBox}>
            <strong>⚠️ Atenção:</strong>
            <p>Não há freelancers cadastrados no sistema. Você pode criar o projeto, mas precisará cadastrar freelancers antes de atribuí-los.</p>
          </div>
        ) : null}

        {/* Título */}
        <Input
          label="Título do Projeto *"
          name="titulo"
          placeholder="Ex: Redesign do Site Corporativo"
          value={form.titulo}
          onChange={handleChange}
          error={errors.titulo}
          required
        />

        {/* Descrição */}
        <div className={styles.fieldGroup}>
          <label htmlFor="descricao">Descrição *</label>
          <textarea
            id="descricao"
            name="descricao"
            placeholder="Descreva os objetivos e escopo do projeto..."
            value={form.descricao}
            onChange={handleChange}
            className={`${styles.textarea} ${errors.descricao ? styles.error : ''}`}
            rows={5}
            required
          />
          {errors.descricao && (
            <span className={styles.errorText}>{errors.descricao}</span>
          )}
        </div>

        {/* Orçamento Total */}
        <Input
          label="Orçamento Total (R$)"
          name="orcamento_total"
          type="number"
          step="0.01"
          placeholder="Ex: 15000.00"
          value={form.orcamento_total}
          onChange={handleChange}
          error={errors.orcamento_total}
        />

        {/* Datas */}
        <div className={styles.dateRow}>
          <Input
            label="Data de Início"
            name="data_inicio"
            type="date"
            value={form.data_inicio}
            onChange={handleChange}
            error={errors.data_inicio}
          />

          <Input
            label="Data de Término Prevista"
            name="data_fim_prevista"
            type="date"
            value={form.data_fim_prevista}
            onChange={handleChange}
            error={errors.data_fim_prevista}
          />
        </div>

        {/* Dica de UX */}
        <div className={styles.infoBox}>
          <p><strong>💡 Dica:</strong> Após criar o projeto, você poderá adicionar atividades e atribuir freelancers.</p>
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleClose}
            disabled={submitting}
          >
            Cancelar
          </Button>

          <Button 
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Criando..." : "Criar Projeto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}