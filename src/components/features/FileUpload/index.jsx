import { useState, useRef } from "react";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../../../utils/constants";
import { formatFileSize } from "../../../utils/formatters";
import { isValidFileSize, isValidFileType } from "../../../utils/validators";
import Button from "../../ui/Button";
import styles from "./FileUpload.module.css";

export default function FileUpload({ onFileSelect, accept = "*", maxSize = MAX_FILE_SIZE }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      clearFile();
      return;
    }

    // Validações
    setError(null);

    if (!isValidFileSize(file, maxSize)) {
      setError(`Arquivo muito grande. Máximo: ${formatFileSize(maxSize)}`);
      clearFile();
      return;
    }

    // Se accept for específico, valida tipo
    if (accept !== "*" && !isValidFileType(file, ALLOWED_FILE_TYPES)) {
      setError("Tipo de arquivo não permitido");
      clearFile();
      return;
    }

    setSelectedFile(file);
    onFileSelect && onFileSelect(file);

    // Gera preview se for imagem
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect && onFileSelect(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />

      {!selectedFile ? (
        <div className={styles.dropzone} onClick={handleButtonClick}>
          <div className={styles.dropzoneContent}>
            <span className={styles.uploadIcon}>📁</span>
            <p className={styles.dropzoneText}>
              Clique para selecionar o arquivo
            </p>
            <p className={styles.dropzoneHint}>
              Tamanho máximo: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.filePreview}>
          {preview && (
            <img 
              src={preview} 
              alt="Preview" 
              className={styles.previewImage}
            />
          )}

          <div className={styles.fileInfo}>
            <span className={styles.fileName}>📎 {selectedFile.name}</span>
            <span className={styles.fileSize}>{formatFileSize(selectedFile.size)}</span>
          </div>

          <Button 
            variant="secondary" 
            onClick={clearFile}
            style={{ borderColor: '#ef4444', color: '#ef4444' }}
          >
            ✕ Remover
          </Button>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}