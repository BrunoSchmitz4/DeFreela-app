import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { handleLogin, loading, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(false);

  // Se já estiver logado, manda pro dashboard automaticamente
  if (isAuthenticated) {
    navigate("/projects/myProjects");
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setLocalError(true);
      return;
    }

    const result = await handleLogin(email, password);

    if (result.error) {
      // erro global vindo do context
      setLocalError(true);
      return;
    }

    // REDIRECIONA APÓS LOGIN
    navigate("/projects/myProjects");
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>
          Bem-vindo ao <span>DeFreela</span>
        </h1>
        <p className={styles.subtitle}>Conecte-se para gerenciar seus projetos</p>

        <form onSubmit={onSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className={styles.footer}>
          Novo por aqui? <a href="/auth/register">Crie sua conta</a>
        </p>
      </div>

      {/* Modal para erros de login */}
      <Modal
        isOpen={localError}
        onClose={() => setLocalError(false)}
        title="Erro ao entrar"
      >
        <p>Email ou senha inválidos. Tente novamente.</p>
        <div className={styles.modalActions}>
          <Button onClick={() => setLocalError(false)}>Fechar</Button>
        </div>
      </Modal>
    </div>
  );
}

export default Login;
