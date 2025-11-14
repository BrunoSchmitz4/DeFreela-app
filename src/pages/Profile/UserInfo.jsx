import styles from "./UserInfo.module.css";
import Button from "../../components/ui/Button";

export default function UserInfo({ user, isMyProfile }) {
  return (
    <div className={styles.userInfoContainer}>
      {/* Foto */}
      <img src={user.photo} alt={user.name} className={styles.avatar} />

      <div className={styles.info}>
        {/* Nome */}
        <h1>{user.name}</h1>

        {/* Bio / descrição */}
        <p className={styles.description}>{user.description}</p>

        {/* Rating (sempre pode existir, todo user é freelancer também) */}
        {user.rating !== null && (
          <p className={styles.rating}>⭐ {user.rating}</p>
        )}

        {/* Skills */}
        {user.skills?.length > 0 && (
          <ul className={styles.skills}>
            {user.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        )}

        {/* Botão Editar Perfil (somente no próprio perfil) */}
        {isMyProfile && (
          <Button
            variant="secondary"
            className={styles.editButton}
            onClick={() => console.log("Editar perfil futuramente")}
          >
            Editar Perfil
          </Button>
        )}
      </div>
    </div>
  );
}
