import { useState, useEffect } from "react";
import { FreelancerRepository } from "../../../repos/FreelancerRepository";
import { ProjetoFreelancerRepository } from "../../../repos/ProjetoFreelancerRepository"
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button"
import styles from "./AssingFreelancerModal.module.css"
import { formatCurrency } from "../../../utils/formatters";
import { validators } from "../../../utils/validators"

export default function AssignFreelancerModal({ 
  isOpen, 
  onClose, 
  projectId,
  onSuccess 
}) {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [form, setForm] = useState({
    papel: "",
    valor_acordado: ""
  });
  const [errors, setErrors] = useState({});

  // Carrega freelancers disponíveis
  useEffect(() => {
    async function loadFreelancers() {
      setLoading(true);
      try {
        const allFreelancers = await FreelancerRepository.search("");
        
        // Remove freelancers já atribuídos
        const assignedFreelancers = await ProjetoFreelancerRepository.getByProject(projectId);
        const assignedIds = assignedFreelancers.map(pf => pf.freelancer_id);
        
        const available = allFreelancers.filter(
          f => !assignedIds.includes(f.id)
        );
        
        setFreelancers(available);
      } catch (err) {
        console.error("Erro ao carregar freelancers:", err);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && projectId) {
      loadFreelancers();
    }
  }, [isOpen, projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedFreelancer) {
      newErrors.freelancer = "Selecione um freelancer";
    }

    if (!validators.required(form.papel).valid) {
      newErrors.papel = "Defina o papel do freelancer";
    }

    if (!validators.positiveNumber(form.valor_acordado).valid) {
      newErrors.valor_acordado = "Valor deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await ProjetoFreelancerRepository.assign(
        projectId,
        selectedFreelancer.id,
        form.papel,
        parseFloat(form.valor_acordado)
      );

      alert("Freelancer atribuído com sucesso!");
      onSuccess && onSuccess();
      handleClose();
    } catch (err) {
      console.error("Erro ao atribuir freelancer:", err);
      alert("Erro ao atribuir freelancer. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFreelancer(null);
    setForm({ papel: "", valor_acordado: "" });
    setErrors({});
    setSearchQuery("");
    onClose();
  };

  const filteredFreelancers = freelancers.filter(f => {
    const query = searchQuery.toLowerCase();
    return (
      f.nome_completo?.toLowerCase().includes(query) ||
      f.habilidades?.toLowerCase().includes(query)
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Atribuir Freelancer ao Projeto">
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Busca de Freelancers */}
        <div className={styles.searchSection}>
          <Input
            label="Buscar Freelancer"
            placeholder="Nome ou habilidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Lista de Freelancers */}
        <div className={styles.freelancerList}>
          {loading ? (
            <p className={styles.loadingText}>Carregando freelancers...</p>
          ) : filteredFreelancers.length === 0 ? (
            <p className={styles.emptyText}>
              {searchQuery 
                ? "Nenhum freelancer encontrado com essa busca." 
                : "Nenhum freelancer disponível. Todos já estão atribuídos."}
            </p>
          ) : (
            filteredFreelancers.map(freelancer => {
              const isSelected = selectedFreelancer?.id === freelancer.id;
              const habilidades = freelancer.habilidades 
                ? freelancer.habilidades.split(',').slice(0, 3)
                : [];

              return (
                <div
                  key={freelancer.id}
                  className={`${styles.freelancerCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedFreelancer(freelancer)}
                >
                  <img 
                    src={freelancer.avatar || `https://i.pravatar.cc/150?u=${freelancer.id}`}
                    alt={freelancer.nome_completo}
                    className={styles.avatar}
                  />
                  
                  <div className={styles.freelancerInfo}>
                    <h4>{freelancer.nome_completo}</h4>
                    
                    {habilidades.length > 0 && (
                      <div className={styles.skills}>
                        {habilidades.map((skill, idx) => (
                          <span key={idx} className={styles.skillTag}>
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {freelancer.valor_hora && (
                      <p className={styles.hourlyRate}>
                        {formatCurrency(freelancer.valor_hora)}/hora
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <div className={styles.selectedIcon}>✓</div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {errors.freelancer && (
          <p className={styles.error}>{errors.freelancer}</p>
        )}

        {/* Formulário de Atribuição */}
        {selectedFreelancer && (
          <div className={styles.assignmentSection}>
            <h3>Detalhes da Atribuição</h3>

            <Input
              label="Papel no Projeto *"
              name="papel"
              placeholder="Ex: Designer Principal, Desenvolvedor Frontend"
              value={form.papel}
              onChange={handleChange}
              error={errors.papel}
              required
            />

            <Input
              label="Valor Acordado (R$) *"
              name="valor_acordado"
              type="number"
              step="0.01"
              placeholder="Ex: 5000.00"
              value={form.valor_acordado}
              onChange={handleChange}
              error={errors.valor_acordado}
              required
            />
          </div>
        )}

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
            disabled={!selectedFreelancer || submitting}
          >
            {submitting ? "Atribuindo..." : "Atribuir Freelancer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}