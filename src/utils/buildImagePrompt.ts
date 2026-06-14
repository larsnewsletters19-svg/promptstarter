import type { ImageFormat } from "../data/options";

interface ImagePromptInputs {
  format: ImageFormat;
  customFormat: string;
  topic: string;
  audience: string;
  textInImage: string;
}

export function buildImagePrompt({
  format,
  customFormat,
  topic,
  audience,
  textInImage,
}: ImagePromptInputs): string {
  const effectiveFormat =
    format === "Annat" && customFormat.trim()
      ? customFormat.trim()
      : format;

  const lines = [
    "Bortse helt från eventuella tidigare bilder, resultat eller instruktioner i denna konversation. Behandla detta som en helt ny, fristående uppgift.",
    "",
    "VIKTIGT: Skapa INTE en bild som liknar referensbilden i motiv eller komposition.",
    "",
    "Jag bifogar en referensbild ENDAST som källa för en färgpalett och stämning.",
    "",
    "Steg 1: Titta på referensbilden och identifiera ENDAST dess färgpalett (vilka färger används) och allmänna känsla (t.ex. varm, kall, lugn, energisk).",
    "",
    "Steg 2: Glöm helt bort vad referensbilden föreställer, dess komposition, dess motiv och dess uppbyggnad.",
    "",
    "Steg 3: Skapa en helt ny bild med ett helt annat motiv, helt annan komposition och helt annan uppbyggnad. Den nya bilden ska föreställa: " + (topic.trim() || "Inte angivet"),
    "",
    "Den nya bilden ska ENDAST dela färgpalett och allmän känsla med referensbilden. Allt annat ska vara nytt och annorlunda.",
    "",
    "Bildformat: " + effectiveFormat,
    "Målgrupp: " + (audience.trim() || "Inte angivet"),
  ];

  if (textInImage.trim()) {
    lines.push("Text som ska synas i bilden: " + textInImage.trim());
  } else {
    lines.push("Bilden ska inte innehålla text.");
  }

  lines.push(
    "",
    "Viktigt:",
    "- Kopiera inte referensbildens motiv, objekt eller komposition rakt av.",
    "- Skapa ett nytt motiv som visuellt representerar ämnet ovan.",
    "- Behåll endast känslan, stilen och färgkänslan från referensbilden.",
    "- Anpassa bildens komposition till angivet bildformat.",
    "",
    "Generera bilden direkt som svar."
  );

  return lines.join("\n");
}