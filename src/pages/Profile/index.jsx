import { useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import UserInfo from "./UserInfo";
import CardList from "../../components/CardList";
import ProjectCard from "../../components/ProjectCard";
import freelancers from "../../mocks/freelancers";
import projects from "../../mocks/projects";

export default function Profile() {
  const { id } = useParams();

  const loggedUser = {
    idUser: 1,
    name: "Bruno Ferreira",
    role: "contratante",
    description:
      "Apaixonado por tecnologia e desenvolvimento web, com foco em React e UI/UX.",
    email: "bruno.ferreira@example.com",
    photo: "https://avatars.githubusercontent.com/u/583231?v=4",
  };


  const isMyProfile = !id || Number(id) === loggedUser.idUser;

  const freelancerData = freelancers.find((f) => f.id === Number(id));

  const normalizeUser = (user) => {
    if (!user) return null;

    return {
      idUser: user.idUser ?? user.id,
      name: user.name,
      role: user.role ?? "freelancer",
      description: user.description ?? user.bio ?? "",
      email: user.email ?? "email_indisponivel@example.com",
      photo: user.photo ?? user.avatar ?? "",
      skills: user.skills ?? [],
      rating: user.rating ?? null,
    };
  };


  const rawUser = isMyProfile ? loggedUser : freelancerData;
  const profileUser = normalizeUser(rawUser);

  if (!profileUser) {
    return <p style={{ padding: 20 }}>Usuário não encontrado.</p>;
  }

  const userOwnedProjects =
    profileUser.role === "contratante"
      ? projects.filter((p) => p.ownerId === profileUser.idUser)
      : [];

  const userFreelancerJobs = projects.filter(
    (p) =>
      p.freelancerId === profileUser.idUser ||
      p.frelancerId === profileUser.idUser
  );

  return (
    <div className={styles.profileContainer}>
      <UserInfo user={profileUser} />

      {/* Se for freelancer */}
      {profileUser.role === "freelancer" && (
        <section className={styles.profileSection}>
          <h2>Projetos em que está trabalhando</h2>

          {userFreelancerJobs.length === 0 ? (
            <p>Nenhum trabalho encontrado.</p>
          ) : (
            <CardList
              renderItem={userFreelancerJobs.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            />
          )}
        </section>
      )}

      {/* Se for contratante */}
      {profileUser.role === "contratante" && (
        <section className={styles.profileSection}>
          <h2>Projetos criados</h2>

          {userOwnedProjects.length === 0 ? (
            <p>Você ainda não criou nenhum projeto.</p>
          ) : (
            <CardList
              renderItem={userOwnedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            />
          )}
        </section>
      )}
    </div>
  );
}
