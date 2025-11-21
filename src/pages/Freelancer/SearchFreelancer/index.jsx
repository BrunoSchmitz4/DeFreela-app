import { useState, useEffect, useMemo } from "react";
import { useFreelancersContext } from "../../../context/freelancerContext";
import FreelancerCard from "../../../components/FreelancerCard";
import CardList from "../../../components/CardList";
import Input from "../../../components/ui/Input";
import styles from './SearchFreelancer.module.css';
import { formatCurrency } from "../../../utils/formatters";

export default function SearchFreelancers() {
  const { freelancers, loading, searchFreelancers } = useFreelancersContext();
  
  // Estados de busca e filtros
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, pj, pf
  const [filterSkill, setFilterSkill] = useState("");
  const [minHourlyRate, setMinHourlyRate] = useState("");
  const [maxHourlyRate, setMaxHourlyRate] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, rate_asc, rate_desc, rating

  // UC06 - Busca inicial
  useEffect(() => {
    searchFreelancers("");
  }, []);

  // UC06 - Lista de habilidades únicas
  const allSkills = useMemo(() => {
    const skillsSet = new Set();
    freelancers.forEach(f => {
      if (f.habilidades) {
        f.habilidades.split(',').forEach(skill => {
          skillsSet.add(skill.trim());
        });
      }
    });
    return Array.from(skillsSet).sort();
  }, [freelancers]);

  // UC06 - Aplicar filtros e ordenação
  const filteredFreelancers = useMemo(() => {
    let result = [...freelancers];

    // Busca por nome
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(f =>
        f.nome_completo?.toLowerCase().includes(q) ||
        f.email?.toLowerCase().includes(q)
      );
    }

    // Filtro por tipo (PJ/PF)
    if (filterType !== "all") {
      const isPJ = filterType === "pj";
      result = result.filter(f => f.is_pj === isPJ);
    }

    // Filtro por habilidade
    if (filterSkill) {
      result = result.filter(f => {
        if (!f.habilidades) return false;
        const skills = f.habilidades.toLowerCase().split(',').map(s => s.trim());
        return skills.includes(filterSkill.toLowerCase());
      });
    }

    // Filtro por valor/hora mínimo
    if (minHourlyRate) {
      const min = parseFloat(minHourlyRate);
      result = result.filter(f => (f.valor_hora || 0) >= min);
    }

    // Filtro por valor/hora máximo
    if (maxHourlyRate) {
      const max = parseFloat(maxHourlyRate);
      result = result.filter(f => (f.valor_hora || 0) <= max);
    }

    // Ordenação
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));
        break;
      case "rate_asc":
        result.sort((a, b) => (a.valor_hora || 0) - (b.valor_hora || 0));
        break;
      case "rate_desc":
        result.sort((a, b) => (b.valor_hora || 0) - (a.valor_hora || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return result;
  }, [freelancers, query, filterType, filterSkill, minHourlyRate, maxHourlyRate, sortBy]);

  // UC06 - Estatísticas
  const stats = useMemo(() => {
    const total = freelancers.length;
    const pj = freelancers.filter(f => f.is_pj).length;
    const pf = total - pj;
    
    const rates = freelancers.map(f => f.valor_hora || 0).filter(r => r > 0);
    const avgRate = rates.length > 0 
      ? rates.reduce((sum, r) => sum + r, 0) / rates.length 
      : 0;

    return {
      total,
      pj,
      pf,
      avgRate
    };
  }, [freelancers]);

  // Limpar todos os filtros
  const clearFilters = () => {
    setQuery("");
    setFilterType("all");
    setFilterSkill("");
    setMinHourlyRate("");
    setMaxHourlyRate("");
    setSortBy("name");
  };

  const hasActiveFilters = query || filterType !== "all" || filterSkill || 
                           minHourlyRate || maxHourlyRate || sortBy !== "name";

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando freelancers...</p>
      </div>
    );
  }

  const cards = filteredFreelancers.map((f) => (
    <FreelancerCard key={f.id} freelancer={f} />
  ));

  return (
    <div className={styles.container}>
      {/* Header com Estatísticas */}
      <header className={styles.header}>
        <h1>Buscar Freelancers</h1>

        {/* UC06 - Estatísticas */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pessoa Jurídica</span>
            <span className={styles.statValue}>{stats.pj}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pessoa Física</span>
            <span className={styles.statValue}>{stats.pf}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Valor/hora Médio</span>
            <span className={styles.statValue} style={{ fontSize: '1.2rem' }}>
              {formatCurrency(stats.avgRate)}
            </span>
          </div>
        </div>

        {/* UC06 - Busca por Nome */}
        <div className={styles.searchSection}>
          <Input
            placeholder="Digite nome ou email do freelancer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* UC06 - Filtros Avançados */}
        <div className={styles.filtersRow}>
          {/* Filtro por Tipo */}
          <div className={styles.filterGroup}>
            <label>Tipo:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos</option>
              <option value="pj">Pessoa Jurídica</option>
              <option value="pf">Pessoa Física</option>
            </select>
          </div>

          {/* Filtro por Habilidade */}
          <div className={styles.filterGroup}>
            <label>Habilidade:</label>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Valor/hora Mínimo */}
          <div className={styles.filterGroup}>
            <label>Valor/hora Mín:</label>
            <Input
              type="number"
              placeholder="Ex: 50"
              value={minHourlyRate}
              onChange={(e) => setMinHourlyRate(e.target.value)}
            />
          </div>

          {/* Valor/hora Máximo */}
          <div className={styles.filterGroup}>
            <label>Valor/hora Máx:</label>
            <Input
              type="number"
              placeholder="Ex: 200"
              value={maxHourlyRate}
              onChange={(e) => setMaxHourlyRate(e.target.value)}
            />
          </div>

          {/* Ordenação */}
          <div className={styles.filterGroup}>
            <label>Ordenar:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="name">Por Nome (A-Z)</option>
              <option value="rate_asc">Menor Valor/hora</option>
              <option value="rate_desc">Maior Valor/hora</option>
              <option value="rating">Melhor Avaliação</option>
            </select>
          </div>
        </div>

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <div className={styles.clearFilters}>
            <button onClick={clearFilters} className={styles.clearButton}>
              ✕ Limpar todos os filtros
            </button>
          </div>
        )}

        {/* Contador de Resultados */}
        <div className={styles.resultsInfo}>
          Exibindo {filteredFreelancers.length} de {freelancers.length} freelancers
          {query && (
            <span className={styles.searchInfo}>
              {' '}para "{query}"
            </span>
          )}
        </div>
      </header>

      {/* Lista de Freelancers */}
      {freelancers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h2>Nenhum freelancer cadastrado</h2>
          <p>Ainda não há freelancers disponíveis no sistema.</p>
        </div>
      ) : filteredFreelancers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2>Nenhum freelancer encontrado</h2>
          <p>Tente ajustar os filtros de busca.</p>
          <button onClick={clearFilters} className={styles.clearButton}>
            Limpar Filtros
          </button>
        </div>
      ) : (
        <CardList renderItem={cards} />
      )}
    </div>
  );
}