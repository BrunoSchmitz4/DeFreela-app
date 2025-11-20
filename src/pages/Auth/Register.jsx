import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

import styles from "./Register.module.css";
import { useAuth } from "../../context/authContext";

function Register() {
  const navigate = useNavigate();
  const { handleRegister, authLoading, error, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorModal, setErrorModal] = useState(false);

  // se já autenticado, manda para dashboard (segurança extra)
  if (isAuthenticated) {
    navigate("/projects/myProjects");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorModal(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorModal(true);
      return;
    }

    const result = await handleRegister(name, email, password);
    if (result.error) {
      setErrorModal(true);
      return;
    }

    // auto-login já feito dentro do handleRegister → redireciona
    navigate("/projects/myProjects");
  }

return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Crie sua conta no <span>DeFreela</span></h1>
        <p className={styles.subtitle}>Junte-se à comunidade de freelancers</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Nome completo" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" placeholder="exemplo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Senha" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="Confirmar senha" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <Button type="submit" fullWidth disabled={authLoading}>
            {authLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className={styles.footer}>Já possui conta? <a href="/login">Entrar</a></p>
      </div>

      <Modal isOpen={errorModal} onClose={() => setErrorModal(false)} title="Erro">
        <p>{error || "Erro ao criar conta. Tente novamente."}</p>
        <div className={styles.modalActions}>
          <Button onClick={() => setErrorModal(false)}>Fechar</Button>
        </div>
      </Modal>
    </div>
  );
}

export default Register;
