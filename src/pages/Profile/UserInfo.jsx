import styles from "./UserInfo.module.css";
import Button from "../../components/ui/Button";

export default function UserInfo({ user, isMyProfile }) {
  return (
    <div className={styles.userInfoContainer}>
      <img src={user.photo} alt={user.name} className={styles.avatar} />

      <div className={styles.info}>
        <h1>{user.name}</h1>

        <p className={styles.description}>{user.description}</p>

        {user.role === "freelancer" && (
          <>
            <p className={styles.rating}>
              ⭐ {user.rating ?? "N/A"}
            </p>

            {user.skills?.length > 0 && (
              <ul className={styles.skills}>
                {user.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {isMyProfile && (
          <Button variant="secondary" className={styles.editButton}>
            Editar Perfil
          </Button>
        )}
      </div>
    </div>
  );
}
