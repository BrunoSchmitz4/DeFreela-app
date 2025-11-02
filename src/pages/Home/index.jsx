import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import styles from "./Home.module.css";
import ComponentContainer from "../../components/ComponentContainer";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <h2 className={styles.homeTitle}>Bem-vindo ao DeFreela</h2>
        <p className={styles.homeSubtitle}>
          Conectando freelancers e contratantes de forma simples e eficiente.
        </p>
        <hr />
        <h3>Como Funciona?</h3>
        <p>Primeiro, crie uma conta conosco. Relaxa, é rápido e fácil!</p>
        <p>Depois disso, você pode escolher entre: publicar um projeto ou ofertar trabalhar em um.</p>
      </div>
      <ComponentContainer>
        <p>Que tal buscar um novo projeto para trabalhar? Confira projetos que se encaixem com seu perfil</p>
        <Button
          variant="secondary"
          children="Confira contratos disponíveis"
          type="button"
          onClick={() => navigate("/projects")}
        />
        <p>Precisa de um freelancer? Quer dar um feedback do andamento de um projeto para seu contratante?</p>
        <Button
          variant="secondary"
          children="Veja seus projetos em andamento"
          type="button"
          onClick={() => navigate("/contracts")}
        />
        <p>Manter seu perfil atualizado mostra que você é um usuário ativo e ajuda à encontrar novas oportunidades</p>
        <Button
          variant="secondary"
          children="Acesse seu perfil"
          type="button"
          onClick={() => navigate("/profile")}
        />
      </ComponentContainer>
    </div>
  );
}

export default Home;
