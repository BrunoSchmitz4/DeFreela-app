import { useParams } from "react-router-dom";
import { useState } from "react";
import styles from "./Profile.module.css";

import UserInfo from "./UserInfo";
import CardList from "../../components/CardList";
import ProjectCard from "../../components/ProjectCard";
import Tabs from "../../components/Tabs";

import freelancers from "../../mocks/freelancers";
import projects from "../../mocks/projects";

export default function Profile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Sobre");

  // Mock do usuário logado
  const loggedUser = {
    idUser: 1,
    name: "Bruno Ferreira",
    description:
      "Apaixonado por tecnologia e desenvolvimento web, com foco em React e UI/UX.",
    email: "bruno.ferreira@example.com",
    photo: "https://avatars.githubusercontent.com/u/583231?v=4",
    skills: ["React", "UI/UX", "Front-end"],
    rating: 4.9
  };

  const isMyProfile = !id || Number(id) === loggedUser.idUser;

  // Se for outro perfil, buscamos nos freelancers
  const freelancerData = freelancers.find((f) => f.id === Number(id));

  // Normalizador universal
  const normalizeUser = (user) => {
    if (!user) return null;

    return {
      idUser: user.idUser ?? user.id,
      name: user.name,
      description: user.description ?? user.bio ?? "",
      email: user.email ?? "email_indisponivel@example.com",
      photo: user.photo ?? user.avatar,
      skills: user.skills ?? [],
      rating: user.rating ?? null,
    };
  };

  const rawUser = isMyProfile ? loggedUser : freelancerData;
  const profileUser = normalizeUser(rawUser);

  if (!profileUser) return <p>Usuário não encontrado.</p>;

  // Projetos criados
  const ownedProjects = projects.filter(
    (p) => p.ownerId === profileUser.idUser
  );

  // Projetos como freelancer
  const freelancerJobs = projects.filter(
    (p) =>
      p.freelancerId === profileUser.idUser ||
      p.frelancerId === profileUser.idUser
  );

  return (
    <div className={styles.profileContainer}>
      <UserInfo 
        user={profileUser} 
        isMyProfile={isMyProfile} 
      />

      <Tabs
        tabs={["Sobre", "Projetos", "Trabalhos"]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Sobre" && (
        <section className={styles.profileSection}>
          <p>{profileUser.description}</p>
        </section>
      )}

      {activeTab === "Projetos" && (
        <section className={styles.profileSection}>
          <h2>Projetos Criados</h2>

          {ownedProjects.length === 0 ? (
            <p>Este usuário ainda não criou projetos.</p>
          ) : (
            <CardList
              renderItem={ownedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            />
          )}
        </section>
      )}

      {activeTab === "Trabalhos" && (
        <section className={styles.profileSection}>
          <h2>Trabalhos como Freelancer</h2>

          {freelancerJobs.length === 0 ? (
            <p>Este usuário ainda não está trabalhando em nenhum projeto.</p>
          ) : (
            <CardList
              renderItem={freelancerJobs.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            />
          )}
        </section>
      )}
    </div>
  );
}
