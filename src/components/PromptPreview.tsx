import { useState } from "react";
import styles from "./PromptPreview.module.css";

interface PromptPreviewProps {
  prompt: string;
}

export function PromptPreview({ prompt }: PromptPreviewProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleCopy() {
    // Försök kopiera med Clipboard API (kräver HTTPS eller localhost)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(prompt);
        setCopyStatus("success");
        setTimeout(() => setCopyStatus("idle"), 3000);
      } catch {
        setCopyStatus("error");
      }
    } else {
      // Fallback för miljöer utan Clipboard API
      setCopyStatus("error");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Din prompt</h2>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Kopiera prompt till urklipp"
        >
          {copyStatus === "success" ? "✓ Kopierad" : "Kopiera prompt"}
        </button>
      </div>

      <textarea
        className={styles.textarea}
        value={prompt}
        readOnly
        aria-label="Genererad prompt"
        rows={14}
      />

      {/* Bekräftelse och felmeddelande */}
      {copyStatus === "success" && (
        <p className={styles.successMessage} role="status">
          Prompten är kopierad.
        </p>
      )}
      {copyStatus === "error" && (
        <p className={styles.errorMessage} role="alert">
          Det gick inte att kopiera automatiskt. Markera prompttexten manuellt och kopiera.
        </p>
      )}

      {/* Instruktion för hur prompten används */}
      <div className={styles.instructions}>
        <h3 className={styles.instructionsTitle}>Så använder du prompten:</h3>
        <ol className={styles.instructionsList}>
          <li>Kopiera prompten.</li>
          <li>Öppna ditt godkända AI-verktyg, till exempel Copilot.</li>
          <li>Klistra in prompten där.</li>
          <li>Bifoga relevanta dokument i AI-verktyget.</li>
          <li>Kör prompten.</li>
        </ol>
      </div>
    </div>
  );
}