import styles from "./FreelancerCard.module.css";
import Button from "../ui/Button";
import { Link } from "react-router-dom";


export default function FreelancerCard({ freelancer, onAction, actionLabel }) {
  const skillsArray = freelancer.habilidades ? 
    freelancer.habilidades.split(",").map(skill => skill.trim()) : 
    [];

  return (
    <div className={styles.card}>
      <img src={freelancer.avatar} alt={freelancer.nome_completo} className={styles.avatar} />

      <div className={styles.info}>
        <h3>{freelancer.nome_completo}</h3>
        <p><strong>Email:</strong> {freelancer.email}</p>
        <div className={styles.skills}>
          {skillsArray.map((s, idx) => (
            <span key={idx} className={styles.skill}>{s}</span>
          ))}
        </div>
        <p><strong>Portfolio:</strong> <a href={freelancer.portfolio_url} target="_blank" rel="noopener noreferrer">Ver Link</a></p>
        <p><strong>Valor por hora:</strong> R$ {freelancer.valor_hora}</p>
      </div>
      <div className={styles.actions}>
        <Link to={`/profile/${freelancer.id}`}><Button variant="secondary">Ver Perfil</Button></Link>
        {onAction && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}