import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../context/authContext";
import { ProjectRepository } from "../../repos/ProjectRepository";
import { FreelancerRepository } from "../../repos/FreelancerRepository";

import styles from "./Profile.module.css";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = !id || Number(id) === Number(user?.id);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // --- 1. Buscar perfil ---
        let profile;
        if (isOwnProfile) {
          profile = user; // perfil próprio
        } else {
          profile = await FreelancerRepository.getById(id); // perfil externo
        }
        setProfileData(profile);

        // --- 2. Buscar projetos do usuário ---
        const allProjects = await ProjectRepository.getAll();
        const owned = allProjects.filter((p) => p.ownerId === profile.id);
        setProjects(owned);

        // --- 3. Buscar histórico do freelancer ---
        const jobs = await FreelancerRepository.getJobs(profile.id);
        setWorkHistory(jobs);

      } catch (err) {
        console.error(err);
        setError("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, user, isOwnProfile]);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Carregando perfil...</p>;
  }

  if (error) {
    return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;
  }

  if (!profileData) {
    return <p style={{ padding: "1rem" }}>Perfil não encontrado.</p>;
  }

  return (
    <div className={styles.profileContainer}>
      {/* BLOCO PRINCIPAL DO PERFIL */}
      <section className={styles.userInfo}>
        <div className={styles.userPhotoContainer}>
          <img
            src={profileData.avatar || "https://i.pravatar.cc/150"}
            alt={profileData.name}
            className={styles.userPhoto}
          />
        </div>

        <div>
          <h2 className={styles.userName}>{profileData.name}</h2>
          <p className={styles.userRole}>Freelancer</p>

          <p className={styles.userDescription}>
            {profileData.bio || "Este usuário ainda não adicionou uma bio."}
          </p>

          <p className={styles.userEmail}>{profileData.email}</p>

          {profileData.skills && (
            <p style={{ marginTop: "1rem", color: "#00b7ff" }}>
              <strong>Skills:</strong> {profileData.skills.join(", ")}
            </p>
          )}
        </div>
      </section>

      {/* PROJETOS CRIADOS */}
      <section>
        <h3 style={{ color: "#00b7ff", marginBottom: "0.8rem" }}>
          Projetos Criados
        </h3>

        {projects.length === 0 ? (
          <p style={{ color: "#ccc" }}>Nenhum projeto criado.</p>
        ) : (
          <div className={styles.projectList}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: "#1e1e1e",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #333",
                  width: "100%",
                  maxWidth: "300px"
                }}
              >
                <h4 style={{ color: "#00b7ff" }}>{project.title}</h4>
                <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HISTÓRICO DE TRABALHOS */}
      <section>
        <h3 style={{ color: "#00b7ff", marginBottom: "0.8rem" }}>
          Histórico de Trabalhos
        </h3>

        {workHistory.length === 0 ? (
          <p style={{ color: "#ccc" }}>Nenhum trabalho finalizado.</p>
        ) : (
          <ul style={{ paddingLeft: "1rem" }}>
            {workHistory.map((job) => (
              <li
                key={job.id}
                style={{
                  color: "#ccc",
                  marginBottom: "0.6rem",
                }}
              >
                {job.title} — Status: <strong>{job.status}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
