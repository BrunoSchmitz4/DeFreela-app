import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import styles from "./Login.module.css";
import { login } from "../../services/authService"; // futuramente com axios

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    // validações simples
    if (!email || !password) {
      setErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      await login(email, password); // mock por enquanto
      alert("Login bem-sucedido!"); // depois redireciona
    } catch (err) {
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Bem-vindo ao <span>DeFreela</span></h1>
        <p className={styles.subtitle}>Conecte-se para gerenciar seus projetos</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            name="password"
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

      {/* Modal de erro */}
      <Modal
        isOpen={errorModal}
        onClose={() => setErrorModal(false)}
        title="Erro de Login"
      >
        <p>Email ou senha inválidos. Tente novamente.</p>
        <div className={styles.modalActions}>
          <Button onClick={() => setErrorModal(false)}>Fechar</Button>
        </div>
      </Modal>
    </div>
  );
}

export default Login;
