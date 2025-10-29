import ProjectCard from '../../components/ProjectCard';
import projects from '../../mocks/projects';
import styles from './Contracts.module.css';


function Contracts() {
  return (
    <div className={styles.contractsContent}>
      <h1>Projetos Disponíveis</h1>
      <ul className={styles.contractsList}>
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </ul>
    </div>
  );
}

export default Contracts;
