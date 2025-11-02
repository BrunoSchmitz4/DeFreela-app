import styles from "./Profile.module.css";
import UserInfo from "./UserInfo";
import UserProjects from "./UserProjects";
import projects from "../../mocks/projects";
import ProjectCard from "../../components/ProjectCard";
import CardList from "../../components/CardList";

function Profile() {

   // Mock temporário (depois vem do useAuth)
   // Ele vai simular que estamos logados no usuário abaixo
  const user = {
    idUser: 1,
    name: "Bruno Ferreira",
    role: "Desenvolvedor Frontend",
    description:
      "Apaixonado por tecnologia e desenvolvimento web, com foco em React e UI/UX.",
    email: "bruno.ferreira@example.com",
    photo: "https://avatars.githubusercontent.com/u/583231?v=4",
  };

  // Projetos aceitos pelo usuário freelancer
  const userContracts = projects.filter(project => project.frelancerId === user.idUser);
  // Projetos criados pelo usuário contratante
  const userProjects = projects.filter(project => project.ownerId === user.idUser);

  return (
    <div className={styles.profileContainer}>
      <UserInfo user={user} />
      <section className={styles.profileProjects}>
        <h2>Visão geral dos projetos envolvidos</h2>
        <CardList renderItem={userContracts.map((project) => (
          <ProjectCard key={project.id} project={project}/>
        ))}/>
      </section>
      <section className={styles.profileProjects}>
        <h2>Visão geral dos projetos criados</h2>
        <CardList renderItem={userProjects.map((project) => (
          <ProjectCard key={project.id} project={project}/>
        ))}/>
      </section>
    </div>
  );
}

export default Profile;
