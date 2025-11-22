import { useState, useEffect } from "react";
import { FreelancerRepository } from "../../../repos/FreelancerRepository";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import AddFreelancerModal from "../../../components/features/freelancers/AddFreelancerModal";
import EditFreelancerModal from "../../../components/features/freelancers/EditFreelancerModal";
import styles from './MyFreelancers.module.css';
import { formatCurrency } from "../../../utils/formatters";

export default function MyFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  useEffect(() => {
    loadFreelancers();
  }, []);

  async function loadFreelancers() {
    setLoading(true);
    try {
      const data = await FreelancerRepository.search("");
      setFreelancers(data);
    } catch (err) {
      console.error("Erro ao carregar freelancers:", err);
    } finally {
      setLoading(false);
    }
  }

  // UC01 - Filtrar freelancers pela busca
  const filteredFreelancers = freelancers.filter(f => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      f.nome_completo?.toLowerCase().includes(query) ||
      f.email?.toLowerCase().includes(query) ||
      f.cpf_cnpj?.toLowerCase().includes(query)
    );
  });

  // UC01 - Abrir modal de edição
  function handleEdit(freelancer) {
    setSelectedFreelancer(freelancer);
    setShowEditModal(true);
  }

  // UC01 - Remover/Desativar freelancer
  async function handleDeactivate(freelancer) {
    // Verificar se tem projetos ativos
    const hasActive = await FreelancerRepository.hasActiveProjects(freelancer.id);
    
    if (hasActive) {
      alert(`Não é possível remover ${freelancer.nome_completo} pois ele/ela está vinculado a projetos ativos.`);
      return;
    }

    const confirm = window.confirm(
      `Tem certeza que deseja desativar ${freelancer.nome_completo}?\n\nEle/ela não poderá mais ser atribuído a novos projetos.`
    );

    if (!confirm) return;

    try {
      await FreelancerRepository.deactivate(freelancer.id);
      alert("Freelancer desativado com sucesso!");
      loadFreelancers(); // Recarrega lista
    } catch (err) {
      console.error("Erro ao desativar freelancer:", err);
      alert("Erro ao desativar freelancer. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Meus Freelancers</h1>
        <Button onClick={() => setShowAddModal(true)}>
          + Adicionar Freelancer
        </Button>
      </div>

      {/* Busca */}
      <div className={styles.searchSection}>
        <Input
          placeholder="Buscar por nome, email ou CPF/CNPJ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Estatísticas */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Freelancers</span>
          <span className={styles.statValue}>{freelancers.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pessoa Jurídica</span>
          <span className={styles.statValue}>
            {freelancers.filter(f => f.is_pj).length}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pessoa Física</span>
          <span className={styles.statValue}>
            {freelancers.filter(f => !f.is_pj).length}
          </span>
        </div>
      </div>

      {/* Lista de Freelancers */}
      {filteredFreelancers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {searchQuery ? "Nenhum freelancer encontrado." : "Você ainda não cadastrou nenhum freelancer."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowAddModal(true)}>
              Cadastrar Primeiro Freelancer
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.freelancersList}>
          {filteredFreelancers.map(freelancer => {
            const habilidades = freelancer.habilidades 
              ? freelancer.habilidades.split(',').map(h => h.trim())
              : [];

            return (
              <div key={freelancer.id} className={styles.freelancerCard}>
                {/* Header do Card */}
                <div className={styles.cardHeader}>
                  <div className={styles.freelancerInfo}>
                    <h3>{freelancer.nome_completo}</h3>
                    <span className={styles.freelancerType}>
                      {freelancer.is_pj ? "PJ" : "PF"}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit(freelancer)}
                      title="Editar freelancer"
                    >
                      ✏️
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeactivate(freelancer)}
                      title="Desativar freelancer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Dados do Card */}
                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Email:</span>
                    <span>{freelancer.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>CPF/CNPJ:</span>
                    <span>{freelancer.cpf_cnpj}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Valor/Hora:</span>
                    <span className={styles.hourlyRate}>
                      {formatCurrency(freelancer.valor_hora)}
                    </span>
                  </div>
                  
                  {/* Habilidades */}
                  {habilidades.length > 0 && (
                    <div className={styles.skillsSection}>
                      <span className={styles.label}>Habilidades:</span>
                      <div className={styles.skillsContainer}>
                        {habilidades.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className={styles.skillBadge}>
                            {skill}
                          </span>
                        ))}
                        {habilidades.length > 5 && (
                          <span className={styles.moreSkills}>
                            +{habilidades.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Portfólio */}
                  {freelancer.portfolio_url && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Portfólio:</span>
                      <a 
                        href={freelancer.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.portfolioLink}
                      >
                        Ver portfólio
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddFreelancerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          loadFreelancers();
        }}
      />

      <EditFreelancerModal
        isOpen={showEditModal}
        freelancer={selectedFreelancer}
        onClose={() => {
          setShowEditModal(false);
          setSelectedFreelancer(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedFreelancer(null);
          loadFreelancers();
        }}
      />
    </div>
  );
}