import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { register } from "../../services/authService";

import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  // estados dos inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // loading & modals
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    // validações básicas
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Preencha todos os campos.");
      setErrorModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      setErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);

      // Registro concluído
      setSuccessModal(true);
    } catch (err) {
      setErrorMessage(err.message || "Erro ao registrar.");
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>
          Crie sua conta no <span>DeFreela</span>
        </h1>
        <p className={styles.subtitle}>Junte-se à comunidade de freelancers</p>

        <form onSubmit={handleRegister} className={styles.form}>
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className={styles.footer}>
          Já possui conta? <a href="/login">Entrar</a>
        </p>
      </div>

      {/* Modal de erro */}
      <Modal
        isOpen={errorModal}
        onClose={() => setErrorModal(false)}
        title="Erro ao registrar"
      >
        <p>{errorMessage}</p>
        <div className={styles.modalActions}>
          <Button onClick={() => setErrorModal(false)}>Fechar</Button>
        </div>
      </Modal>

      {/* Modal de sucesso */}
      <Modal
        isOpen={successModal}
        onClose={() => {
          setSuccessModal(false);
          navigate("/login");
        }}
        title="Conta criada!"
      >
        <p>Seu cadastro foi realizado com sucesso! Agora é só fazer login.</p>
        <div className={styles.modalActions}>
          <Button
            onClick={() => {
              setSuccessModal(false);
              navigate("/login");
            }}
          >
            Ir para login
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Register;
