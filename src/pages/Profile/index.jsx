import styles from "./Profile.module.css";
import UserInfo from "./UserInfo";
import UserProjects from "./UserProjects";
import projects from "../../mocks/projects";

function Profile() {

   // Mock temporário (depois vem do useAuth)
  const user = {
    idUser: 1,
    name: "Bruno Ferreira",
    role: "Desenvolvedor Frontend",
    description:
      "Apaixonado por tecnologia e desenvolvimento web, com foco em React e UI/UX.",
    email: "bruno.ferreira@example.com",
    photo: "https://avatars.githubusercontent.com/u/583231?v=4",
  };

  return (
    <div className={styles.profileContainer}>
      <UserInfo user={user} />
      <UserProjects projects={projects.filter(project => project.frelancerId === user.idUser)} />
    </div>
  );
}

export default Profile;
