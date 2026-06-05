import { useState } from "react";
import styles from "./PromptAnalyzer.module.css";

// Bygger analysrampan runt användarens prompt
function buildAnalysisPrompt(userPrompt: string): string {
  return `Du är en expert på att skriva och analysera AI-prompter, med särskild erfarenhet av hur konsulter och chefer inom IT och bank använder AI-verktyg som Microsoft Copilot i sitt dagliga arbete.

Nedan följer en prompt som en användare har skrivit. Analysera den noggrant och returnera ett svar enligt exakt denna struktur:

---

## 1. Förbättrad prompt
Skriv en komplett, förbättrad version av prompten som användaren kan kopiera och använda direkt. Den förbättrade prompten ska:
- Ha en tydlig roll som styr ton och kompetens
- Ha en specifik och mätbar uppgift
- Innehålla instruktioner om vilket underlag AI:n ska använda
- Skydda mot hallucination genom att be AI:n markera antaganden och saknad information
- Definiera exakt vilket format svaret ska ha
- Vara praktiskt användbar för en konsult eller chef i ett verkligt uppdrag

## 2. Vad som saknades eller var otydligt
Lista tre till fem konkreta punkter om vad den ursprungliga prompten saknade eller kunde förbättras. För varje punkt, förklara kort varför det spelar roll för kvaliteten på AI:ns svar. Var specifik – undvik generella råd som "var tydligare".

## 3. Bedömning av originalprompten
Ge en kort och ärlig bedömning av originalprompten i tre delar:
- Vad fungerade bra
- Vad var svagt eller saknades
- Hur stor skillnad den förbättrade versionen troligen gör i praktiken

## 4. Lärdomen
Skriv en enda konkret mening som sammanfattar den viktigaste lärdomen från analysen – något användaren kan ta med sig nästa gång de skriver en prompt själva.

## 5. Promptens byggstenar – så här är den uppbyggd
Gå igenom den förbättrade prompten del för del. För varje del, förklara:
- Vad den gör
- Varför den är med
- Vad som händer om den saknas

Skriv så att någon som aldrig skrivit en AI-prompt tidigare förstår. Undvik teknisk jargong.

---

Här är prompten som ska analyseras:

${userPrompt}`;
}
export function PromptAnalyzer() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  function handleAnalyze() {
    if (!inputPrompt.trim()) return;
    const result = buildAnalysisPrompt(inputPrompt);
    setAnalysisPrompt(result);
  }

  async function handleCopy() {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(analysisPrompt);
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
      <h2 className={styles.title}>Analysera din prompt</h2>
      <p className={styles.description}>
        Klistra in en prompt du vill förbättra och klicka på "Skapa analysprompt". 
        En ny prompt skapas som du kopierar med knappen som visas och klistrar in 
        i ditt AI-verktyg, till exempel Copilot. AI:n analyserar din prompt och 
        ger dig en förbättrad version med förklaringar.
      </p>

      <div className={styles.inputSection}>
        <label htmlFor="userPrompt" className={styles.label}>
          Din prompt
        </label>
        <textarea
          id="userPrompt"
          className={styles.textarea}
          value={inputPrompt}
          onChange={(e) => {
            setInputPrompt(e.target.value);
            setAnalysisPrompt("");
          }}
          placeholder="Klistra in eller skriv din prompt här..."
          rows={8}
        />
      </div>

      <button
        className={styles.analyzeButton}
        onClick={handleAnalyze}
        disabled={!inputPrompt.trim()}
      >
        Skapa analysprompt
      </button>

      {analysisPrompt && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <h3 className={styles.resultTitle}>Din analysprompt</h3>
            <button
              className={styles.copyButton}
              onClick={handleCopy}
              aria-label="Kopiera analysprompt"
            >
              {copyStatus === "success" ? "✓ Kopierad" : "Kopiera"}
            </button>
          </div>

          <textarea
            className={styles.resultTextarea}
            value={analysisPrompt}
            readOnly
            rows={16}
            aria-label="Genererad analysprompt"
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
            <h4 className={styles.instructionsTitle}>Nästa steg:</h4>
            <ol className={styles.instructionsList}>
              <li>Kopiera analysprompten.</li>
              <li>Öppna ditt godkända AI-verktyg, till exempel Copilot.</li>
              <li>Klistra in analysprompten där.</li>
              <li>Läs igenom analysen och den förbättrade prompten.</li>
              <li>Använd den förbättrade prompten i ditt nästa uppdrag.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}