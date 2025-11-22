import { useState } from "react";
import Modal from "../../ui/Modal";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import FileUpload from "../FileUpload";
import styles from "./SubmitDeliveryModal.module.css";

export default function SubmitDeliveryModal({ isOpen, onClose, onSubmit, task }) {
  const [file, setFile] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Selecione um arquivo para enviar");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Aqui você pode fazer upload do arquivo primeiro
      // const fileUrl = await uploadFile(file);
      
      // Por enquanto, vamos simular com URL fake
      const fakeUrl = `/uploads/${Date.now()}-${file.name}`;

      const payload = {
        arquivo_url: fakeUrl,
        observacoes: observacoes.trim() || null
      };

      await onSubmit(payload);
      
      handleClose();
    } catch (err) {
      console.error("Erro ao enviar entrega:", err);
      setError("Erro ao enviar entrega. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setObservacoes("");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Enviar Entrega">
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Info da Tarefa */}
        {task && (
          <div className={styles.taskInfo}>
            <strong>Tarefa:</strong> {task.titulo}
          </div>
        )}

        {/* Upload de Arquivo */}
        <div className={styles.section}>
          <label className={styles.label}>Arquivo *</label>
          <FileUpload 
            onFileSelect={setFile}
            accept="*"
          />
        </div>

        {/* Observações */}
        <div className={styles.section}>
          <label className={styles.label}>Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Adicione comentários sobre a entrega..."
            className={styles.textarea}
            rows={4}
          />
        </div>

        {/* Erro */}
        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {/* Dica */}
        <div className={styles.tip}>
          💡 <strong>Dica:</strong> Verifique se o arquivo está completo e atende aos requisitos da tarefa antes de enviar.
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleClose}
            disabled={uploading}
          >
            Cancelar
          </Button>

          <Button 
            type="submit"
            disabled={!file || uploading}
          >
            {uploading ? "Enviando..." : "Enviar Entrega"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}