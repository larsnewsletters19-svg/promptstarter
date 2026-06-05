import { useState } from "react";
import styles from "./PromptAnalyzer.module.css";

type AnalysisMode = "full" | "improved";

function buildAnalysisPrompt(userPrompt: string, mode: AnalysisMode): string {
  if (mode === "improved") {
    return `Du är en expert på att skriva AI-prompter med särskild erfarenhet av hur konsulter och chefer inom IT och bank använder AI-verktyg som Microsoft Copilot.

Nedan följer en prompt som en användare har skrivit. Din uppgift är att leverera en förbättrad version direkt – utan förklaringar eller analys.

Den förbättrade prompten ska:
- Ha en tydlig roll som styr ton och kompetens
- Ha en specifik och mätbar uppgift
- Innehålla instruktioner om vilket underlag AI:n ska använda
- Skydda mot hallucination genom att be AI:n markera antaganden och saknad information
- Definiera exakt vilket format svaret ska ha
- Vara praktiskt användbar för en konsult eller chef i ett verkligt uppdrag

Returnera ENDAST den förbättrade prompten. Ingen förklaring, ingen analys, ingen inledning.

Här är prompten som ska förbättras:

${userPrompt}`;
  }

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
  const [mode, setMode] = useState<AnalysisMode>("full");
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  function handleAnalyze() {
    if (!inputPrompt.trim()) return;
    const result = buildAnalysisPrompt(inputPrompt, mode);
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
      <h2 className={styles.title}>Förbättra din prompt</h2>
      <p className={styles.description}>
        Klistra in en prompt du vill förbättra och välj vad du vill ha tillbaka.
        Välj "Analys + förbättrad prompt" för att förstå vad som kan bli bättre,
        eller "Bara förbättrad prompt" om du vill ha en ny version direkt.
        Kopiera den genererade analysprompten och klistra in den i ditt AI-verktyg,
        till exempel Copilot. AI:n svarar med en ny och förbättrad prompt som du
        sedan använder i ditt uppdrag.
      </p>

      {/* Lägesväljare */}
      <div className={styles.modeSelector}>
        <label className={`${styles.modeOption} ${mode === "full" ? styles.modeActive : ""}`}>
          <input
            type="radio"
            name="mode"
            value="full"
            checked={mode === "full"}
            onChange={() => { setMode("full"); setAnalysisPrompt(""); }}
            className={styles.modeRadio}
          />
          <span className={styles.modeLabel}>Analys + förbättrad prompt</span>
          <span className={styles.modeHint}>Förstå vad som kan bli bättre</span>
        </label>
        <label className={`${styles.modeOption} ${mode === "improved" ? styles.modeActive : ""}`}>
          <input
            type="radio"
            name="mode"
            value="improved"
            checked={mode === "improved"}
            onChange={() => { setMode("improved"); setAnalysisPrompt(""); }}
            className={styles.modeRadio}
          />
          <span className={styles.modeLabel}>Bara förbättrad prompt</span>
          <span className={styles.modeHint}>Snabbt och rakt på sak</span>
        </label>
      </div>

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
              <li>Kopiera analysprompten med knappen ovan.</li>
              <li>Öppna ditt godkända AI-verktyg, till exempel Copilot.</li>
              <li>Klistra in analysprompten och kör den.</li>
              <li>AI:n svarar med en ny och förbättrad prompt – det är den du ska använda.</li>
              <li>Kopiera den förbättrade prompten från AI:ns svar.</li>
              <li>Starta en ny AI-session, klistra in den förbättrade prompten och bifoga ditt underlag.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}