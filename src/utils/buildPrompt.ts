import type { Role, Task, OutputFormat, SourceType } from "../data/options";
import { managerRoles } from "../data/options";

interface PromptInputs {
  role: Role;
  task: Task;
  outputFormat: OutputFormat;
  sources: SourceType[]; // tom array = inget underlag valt
}

function isManagerRole(role: Role): boolean {
  return managerRoles.includes(role);
}

// Bygger underlags-meningen baserat på vad användaren kryssat i
function buildSourceSection(sources: SourceType[]): string {
  const hasDokument = sources.includes("dokument");
  const hasText = sources.includes("inklistrad text");

  if (hasDokument && hasText) {
    return "Jag bifogar dokument och klistrar in text som underlag i denna session.\nAnvänd ENDAST detta underlag. Gör inga antaganden som inte stöds av underlaget.";
  }
  if (hasDokument) {
    return "Jag bifogar dokument i denna session.\nAnvänd ENDAST dessa dokument som underlag. Gör inga antaganden som inte stöds av dokumenten.";
  }
  if (hasText) {
    return "Text som underlag följer efter denna prompt.\nAnvänd ENDAST denna text som underlag. Gör inga antaganden som inte stöds av texten.";
  }
  // Inget underlag valt – instruera AI att fråga istället för att gissa
  return "Du har inget dokument eller text som underlag.\nBasera inte svaret på antaganden – ställ istället klargörande frågor till mig så att jag kan ge dig rätt information.";
}

export function buildPrompt({
  role,
  task,
  outputFormat,
  sources,
}: PromptInputs): string {
  const isManager = isManagerRole(role);

  const intro = isManager
    ? "Agera som en erfaren " + role + " på ett IT-konsultbolag."
    : "Agera som en senior " + role + ".";

  const sourceSection = buildSourceSection(sources);

  const closing = isManager
    ? "Tänk på att:\n1. Svaret ska vara praktiskt användbart för en konsultchef i vardagen.\n2. Håll en professionell och konstruktiv ton.\n3. Markera tydligt om något saknas eller är oklart.\n4. Antaganden ska märkas ut."
    : "Innan du svarar, kontrollera att:\n1. Svaret bygger på angivet underlag.\n2. Antaganden är tydligt markerade.\n3. Saknad information är tydligt markerad.\n4. Svaret är praktiskt användbart för en konsult i ett kunduppdrag.";

  const lines = [
    intro,
    "",
    sourceSection,
    "",
    "Din uppgift är att " + task + ".",
    "",
    "Svara i formatet: " + outputFormat + ".",
    "",
    closing,
  ];

  return lines.join("\n");
}