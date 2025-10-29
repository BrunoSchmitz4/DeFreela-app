import styles from "./Profile.module.css";
import UserInfo from "./UserInfo";
import UserProjects from "./UserProjects";

function Profile() {
  // Mock temporário (depois vem do useAuth)
  const user = {
    name: "Bruno Ferreira",
    role: "Desenvolvedor Frontend",
    description:
      "Apaixonado por tecnologia e desenvolvimento web, com foco em React e UI/UX.",
    email: "bruno.ferreira@example.com",
    photo: "https://avatars.githubusercontent.com/u/583231?v=4",
  };

  // Mock de projetos (depois virá da API filtrando pelo user)
  const userProjects = [
    {
      id: 1,
      title: "Landing Page para Startup",
      description: "Criação de landing page com React e integração a API de leads.",
      value: 1500,
      deadline: "20 dias",
      tags: ["React", "UI/UX", "Frontend"],
    },
    {
      id: 2,
      title: "Sistema de Gerenciamento de Tarefas",
      description: "App full-stack para controle de tarefas e times.",
      value: 3200,
      deadline: "45 dias",
      tags: ["Node.js", "Express", "MongoDB"],
    },
  ];

  return (
    <div className={styles.profileContainer}>
      <UserInfo user={user} />
      <UserProjects projects={userProjects} />
    </div>
  );
}

export default Profile;
