import { useState } from "react";
import { PromptPreview } from "./PromptPreview";

function buildVisualLearningPrompt(topic: string): string {
  return `Jag vill förstå: ${topic}

Följ dessa steg exakt och i ordning:

## Steg 1 – Brainstorma 5 visuella förklaringsalternativ
Lista fem olika sätt att visuellt förklara ämnet. För varje alternativ, ge:
- En kort titel (max 5 ord)
- En mening som beskriver vad det visar

Välj sedan ut de 2 alternativ du anser är starkast och förklara kort varför kombinationen fungerar bra.

## Steg 2 – Kombinera de 2 bästa alternativen
Kombinera automatiskt de 2 alternativ du valde i steg 1 till ett sammanhängande visuellt läromedel.

## Steg 3 – Skapa en artifact
Bygg resultatet från steg 2 som en artifact: en komplett, interaktiv HTML-sida med CSS och JavaScript inbäkdat.

Krav på artifact:
- Mörkt tema (bakgrund #0f0f13), snygga gradienter och subtila animationer
- Verkligt innehåll som faktiskt förklarar ämnet på djupet
- Interaktivitet (hover, klick, animerade övergångar)
- Titel och kort intro längst upp
- Helt självständig fil – allt CSS och JS inbakat
- Inga externa bibliotek

Kör alla tre steg utan att pausa och vänta på bekräftelse.
Bygg artifact:en som en React- eller HTML-artifact i artifact-panelen, inte som kod i chattflödet.`;
}

export function VisualLearningPrompt() {
  const [topic, setTopic] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  function handleGenerate() {
    if (!topic.trim()) return;
    setGeneratedPrompt(buildVisualLearningPrompt(topic.trim()));
  }

  return (
    <section className="formCard">
      <p style={{ marginBottom: "1rem", color: "#555", fontSize: "0.95rem" }}>
        Skriv in ett ämne så skapar vi en prompt som du klistrar in i Claude.
        Claude brainstormar automatiskt 5 visuella alternativ, väljer de 2
        bästa, kombinerar dem och bygger en interaktiv artifact – allt i ett
        svep.
      </p>

      <div className="formGrid">
        <div>
          <label
            htmlFor="visualTopic"
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "0.4rem",
              fontSize: "0.9rem",
            }}
          >
            Ämne
          </label>
          <input
            id="visualTopic"
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setGeneratedPrompt("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="T.ex. hur ett neuralt nätverk fungerar, kvantfysik, fotosyntesen..."
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <button
        className="generateButton"
        onClick={handleGenerate}
        disabled={!topic.trim()}
        style={{ marginTop: "1rem" }}
      >
        Skapa prompt
      </button>

      {generatedPrompt && (
        <div style={{ marginTop: "1.5rem" }}>
          <PromptPreview prompt={generatedPrompt} />
        </div>
      )}
    </section>
  );
}
