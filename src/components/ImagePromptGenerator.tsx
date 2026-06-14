import { useState } from "react";
import type { ImageFormat } from "../data/options";
import { imageFormats, imageTopicSuggestions, imageAudienceSuggestions } from "../data/options";
import { buildImagePrompt } from "../utils/buildImagePrompt";
import styles from "./ImagePromptGenerator.module.css";

export function ImagePromptGenerator() {
  const [format, setFormat] = useState<ImageFormat | "">("");
  const [customFormat, setCustomFormat] = useState("");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [textInImage, setTextInImage] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const allSelected = format && topic.trim() && audience.trim();

  function handleGenerate() {
    if (!allSelected) return;
    const prompt = buildImagePrompt({
      format: format as ImageFormat,
      customFormat,
      topic,
      audience,
      textInImage,
    });
    setGeneratedPrompt(prompt);
  }

  async function handleCopy() {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        setCopyStatus("success");
        setTimeout(() => setCopyStatus("idle"), 3000);
      } catch {
        setCopyStatus("error");
      }
    } else {
      setCopyStatus("error");
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Skapa prompt från referensbild</h2>
      <p className={styles.description}>
        Har du en bild du gillar – en design, ett foto, en illustration? Den här
        funktionen skapar en prompt som hjälper ditt AI-verktyg analysera bilden
        och använda dess stil, känsla och uppbyggnad som inspiration för att skapa
        något helt nytt åt dig. Originalbilden kopieras inte – AI:n skapar något
        eget baserat på vad som fungerar bra i den.
      </p>

      {/* Bildformat */}
      <div className={styles.field}>
        <label htmlFor="format" className={styles.label}>Bildformat</label>
        <select
          id="format"
          className={styles.select}
          value={format}
          onChange={(e) => { setFormat(e.target.value as ImageFormat); setGeneratedPrompt(""); }}
        >
          <option value="" disabled>Välj bildformat...</option>
          {imageFormats.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {format === "Annat" && (
          <input
            type="text"
            className={styles.input}
            value={customFormat}
            onChange={(e) => { setCustomFormat(e.target.value); setGeneratedPrompt(""); }}
            placeholder="Ange önskat format..."
          />
        )}
      </div>

      {/* Ämne */}
      <div className={styles.field}>
        <label htmlFor="topic" className={styles.label}>Vad ska den nya bilden föreställa?</label>
        <input
          id="topic"
          type="text"
          className={styles.input}
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setGeneratedPrompt(""); }}
          placeholder="Beskriv ämnet..."
        />
        <div className={styles.suggestions}>
          {imageTopicSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              className={styles.suggestionChip}
              onClick={() => { setTopic(s); setGeneratedPrompt(""); }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Målgrupp */}
      <div className={styles.field}>
        <label htmlFor="audience" className={styles.label}>Vem är målgruppen?</label>
        <input
          id="audience"
          type="text"
          className={styles.input}
          value={audience}
          onChange={(e) => { setAudience(e.target.value); setGeneratedPrompt(""); }}
          placeholder="Beskriv målgruppen..."
        />
        <div className={styles.suggestions}>
          {imageAudienceSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              className={styles.suggestionChip}
              onClick={() => { setAudience(s); setGeneratedPrompt(""); }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Text i bilden */}
      <div className={styles.field}>
        <label htmlFor="textInImage" className={styles.label}>Ska bilden innehålla text? (valfritt)</label>
        <input
          id="textInImage"
          type="text"
          className={styles.input}
          value={textInImage}
          onChange={(e) => { setTextInImage(e.target.value); setGeneratedPrompt(""); }}
          placeholder="T.ex. en rubrik eller ett budskap..."
        />
      </div>

      <button
        className={styles.generateButton}
        onClick={handleGenerate}
        disabled={!allSelected}
      >
        Generera prompt
      </button>

      {generatedPrompt && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <h3 className={styles.resultTitle}>Din prompt</h3>
            <button
              className={styles.copyButton}
              onClick={handleCopy}
              aria-label="Kopiera prompt"
            >
              {copyStatus === "success" ? "✓ Kopierad" : "Kopiera prompt"}
            </button>
          </div>

          <textarea
            className={styles.resultTextarea}
            value={generatedPrompt}
            readOnly
            rows={16}
            aria-label="Genererad prompt"
          />

          {copyStatus === "success" && (
            <p className={styles.successMessage} role="status">
              Prompten är kopierad.
            </p>
          )}
          {copyStatus === "error" && (
            <p className={styles.errorMessage} role="alert">
              Det gick inte att kopiera automatiskt. Markera texten manuellt och kopiera.
            </p>
          )}

          <div className={styles.instructions}>
            <h4 className={styles.instructionsTitle}>Så här gör du:</h4>
            <ol className={styles.instructionsList}>
              <li>Skriv in dina val ovan och klicka på "Generera prompt".</li>
              <li>Kopiera prompten.</li>
              <li><strong>Starta en ny AI-session/chatt</strong> – det ger bäst resultat eftersom AI:n annars kan återanvända tidigare genererade bilder.</li>
              <li>Klistra in prompten och bifoga din referensbild.</li>
              <li>AI:n skapar en ny bild baserat på det du valt.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}