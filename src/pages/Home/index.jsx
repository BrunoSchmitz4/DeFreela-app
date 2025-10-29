import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import styles from "./Home.module.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.homeTitle}>Bem-vindo ao DeFreela</h2>
      <p className={styles.homeSubtitle}>
        Conectando freelancers e contratantes de forma simples e transparente.
      </p>

      <div className={styles.homeInputs}>
        <Input
          type="text"
          placeholder="Como posso te chamar?"
          error="Esse campo não pode ficar vazio, viu?"
        />
        <Input type="number" placeholder="Qual a sua idade?" />
        <Input type="checkbox" label="Você prestará serviço de freelancer?" />
        <Button
          variant="primary"
          children="Ver projetos disponíveis"
          type="button"
          onClick={() => navigate("/projects")}
        />
      </div>
    </div>
  );
}

export default Home;
