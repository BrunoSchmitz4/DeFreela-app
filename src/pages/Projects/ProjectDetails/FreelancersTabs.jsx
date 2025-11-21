import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjetoFreelancerRepository } from "../../../repos/ProjetoFreelancerRepository";
import { FreelancerRepository } from "../../../repos/FreelancerRepository";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import AssignFreelancerModal from "../../../components/features/projects/AssingFreelancerModal"
import styles from "./ProjectDetails.module.css";
import { formatCurrency, formatDate } from "../../../utils/formatters";

export default function FreelancersTab({ project }) {
  const [assignments, setAssignments] = useState([]); // projeto_freelancer
  const [freelancersData, setFreelancersData] = useState({}); // cache de freelancers
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editForm, setEditForm] = useState({ papel: "", valor_acordado: "" });

  // Carrega freelancers atribuídos
  useEffect(() => {
    loadAssignments();
  }, [project.id]);

  async function loadAssignments() {
    setLoading(true);
    try {
      const assignmentsList = await ProjetoFreelancerRepository.getByProject(project.id);
      setAssignments(assignmentsList);

      // Carrega dados completos dos freelancers
      const freelancersMap = {};
      for (const assignment of assignmentsList) {
        if (!freelancersMap[assignment.freelancer_id]) {
          try {
            const freelancer = await FreelancerRepository.getById(assignment.freelancer_id);
            freelancersMap[assignment.freelancer_id] = freelancer;
          } catch (err) {
            console.error("Erro ao carregar freelancer:", err);
          }
        }
      }
      setFreelancersData(freelancersMap);
    } catch (err) {
      console.error("Erro ao carregar atribuições:", err);
    } finally {
      setLoading(false);
    }
  }

  // UC01 - Remover freelancer
  async function handleRemove(freelancerId) {
    const freelancer = freelancersData[freelancerId];
    const confirmMessage = `Tem certeza que deseja remover ${freelancer?.nome_completo || 'este freelancer'} do projeto?`;
    
    if (!window.confirm(confirmMessage)) return;

    try {
      await ProjetoFreelancerRepository.remove(project.id, freelancerId);
      alert("Freelancer removido com sucesso!");
      loadAssignments(); // Recarrega lista
    } catch (err) {
      console.error("Erro ao remover freelancer:", err);
      alert("Erro ao remover freelancer. Tente novamente.");
    }
  }

  // UC01 - Editar atribuição
  function openEditModal(assignment) {
    setEditingAssignment(assignment);
    setEditForm({
      papel: assignment.papel,
      valor_acordado: assignment.valor_acordado
    });
    setShowEditModal(true);
  }

  async function handleEdit(e) {
    e.preventDefault();
    
    try {
      await ProjetoFreelancerRepository.update(
        project.id,
        editingAssignment.freelancer_id,
        editForm.papel,
        parseFloat(editForm.valor_acordado)
      );

      alert("Atribuição atualizada com sucesso!");
      setShowEditModal(false);
      loadAssignments();
    } catch (err) {
      console.error("Erro ao editar atribuição:", err);
      alert("Erro ao atualizar atribuição. Tente novamente.");
    }
  }

  if (loading) {
    return <p>Carregando freelancers...</p>;
  }

  if (assignments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhum freelancer atribuído a este projeto ainda.</p>
        <Button onClick={() => setShowAssignModal(true)}>
          + Atribuir Freelancer
        </Button>

        <AssignFreelancerModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          projectId={project.id}
          onSuccess={loadAssignments}
        />
      </div>
    );
  }

  return (
    <div className={styles.freelancersTab}>
      <div className={styles.tabHeader}>
        <h2>Freelancers do Projeto</h2>
        <div className={styles.headerActions}>
          <span className={styles.freelancerCount}>
            {assignments.length} {assignments.length === 1 ? 'freelancer' : 'freelancers'}
          </span>
          <Button onClick={() => setShowAssignModal(true)}>
            + Atribuir Freelancer
          </Button>
        </div>
      </div>
      
      <div className={styles.freelancersList}>
        {assignments.map((assignment) => {
          const freelancer = freelancersData[assignment.freelancer_id];
          
          if (!freelancer) {
            return (
              <div key={assignment.freelancer_id} className={styles.freelancerCard}>
                <p>Carregando dados do freelancer...</p>
              </div>
            );
          }

          const habilidades = freelancer.habilidades 
            ? freelancer.habilidades.split(',').map(h => h.trim())
            : [];

          return (
            <div key={assignment.freelancer_id} className={styles.freelancerCard}>
              <div className={styles.freelancerAvatar}>
                <img 
                  src={freelancer.avatar || `https://i.pravatar.cc/150?u=${freelancer.id}`} 
                  alt={freelancer.nome_completo}
                />
              </div>
              
              <div className={styles.freelancerInfo}>
                <h3>{freelancer.nome_completo}</h3>
                <p className={styles.freelancerEmail}>{freelancer.email}</p>

                {/* Papel no Projeto */}
                <div className={styles.assignmentInfo}>
                  <span className={styles.roleLabel}>Papel:</span>
                  <span className={styles.roleValue}>{assignment.papel}</span>
                </div>

                {/* Valor Acordado */}
                <div className={styles.assignmentInfo}>
                  <span className={styles.roleLabel}>Valor Acordado:</span>
                  <span className={styles.roleValue}>
                    {formatCurrency(assignment.valor_acordado)}
                  </span>
                </div>

                {/* Data de Atribuição */}
                <p className={styles.assignedDate}>
                  Atribuído em: {formatDate(assignment.atribuido_em)}
                </p>

                {/* Habilidades */}
                {habilidades.length > 0 && (
                  <div className={styles.skillsList}>
                    {habilidades.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className={styles.skillBadge}>
                        {skill}
                      </span>
                    ))}
                    {habilidades.length > 3 && (
                      <span className={styles.skillMore}>
                        +{habilidades.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Valor por hora (informativo) */}
                {freelancer.valor_hora && (
                  <p className={styles.hourlyRate}>
                    <strong>Valor/hora sugerido:</strong> {formatCurrency(freelancer.valor_hora)}
                  </p>
                )}
              </div>

              <div className={styles.freelancerActions}>
                <Link to={`/profile/${freelancer.id}`}>
                  <Button variant="secondary">Ver Perfil</Button>
                </Link>

                {freelancer.portfolio_url && (
                  <a 
                    href={freelancer.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.portfolioLink}
                  >
                    <Button variant="secondary">Portfólio</Button>
                  </a>
                )}

                <Button 
                  variant="secondary"
                  onClick={() => openEditModal(assignment)}
                >
                  Editar Atribuição
                </Button>

                <Button 
                  variant="secondary"
                  onClick={() => handleRemove(freelancer.id)}
                  style={{ 
                    borderColor: '#ef4444', 
                    color: '#ef4444' 
                  }}
                >
                  Remover
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Atribuir Freelancer */}
      <AssignFreelancerModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        projectId={project.id}
        onSuccess={loadAssignments}
      />

      {/* Modal de Editar Atribuição */}
      {showEditModal && editingAssignment && (
        <Modal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)}
          title="Editar Atribuição"
        >
          <form onSubmit={handleEdit} className={styles.modalForm}>
            <p className={styles.editingFreelancer}>
              <strong>Freelancer:</strong> {freelancersData[editingAssignment.freelancer_id]?.nome_completo}
            </p>

            <Input
              label="Papel no Projeto"
              name="papel"
              value={editForm.papel}
              onChange={(e) => setEditForm({ ...editForm, papel: e.target.value })}
              required
            />

            <Input
              label="Valor Acordado (R$)"
              name="valor_acordado"
              type="number"
              step="0.01"
              value={editForm.valor_acordado}
              onChange={(e) => setEditForm({ ...editForm, valor_acordado: e.target.value })}
              required
            />

            <div className={styles.modalActions}>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}