import type { Role, Task, OutputFormat, SourceType } from "../data/options";
import { managerRoles } from "../data/options";

interface PromptInputs {
  role: Role;
  task: Task;
  outputFormat: OutputFormat;
  sources: SourceType[];
}

function isManagerRole(role: Role): boolean {
  return managerRoles.includes(role);
}

// Fokuspunkter per uppgift – ger prompten substans utöver bara uppgiftsnamnet
const taskFocus: Record<Task, string> = {
  // Konsultuppgifter
  "analysera dokumentet":
    "Identifiera syfte, scope och målgrupp. Lyft fram det som är oklart, motsägelsefullt eller saknas. Notera antaganden som dokumentet bygger på.",
  "hitta öppna frågor":
    "Leta efter beslut som inte är tagna, krav som är vaga, ansvarsområden som är otydliga och beroenden som inte är lösta.",
  "förbättra kraven":
    "Kontrollera att varje krav är mätbart, testbart och entydigt. Identifiera krav som överlappar, saknas eller är för tekniska eller för vaga.",
  "skapa testfall":
    "Täck lyckliga flöden, felflöden och gränsfall. Varje testfall ska ha förutsättning, steg och förväntat resultat.",
  "sammanfatta innehållet":
    "Lyft fram syfte, viktigaste beslut, åtaganden och nästa steg. Håll det kort och läsbart för en person som inte läst dokumentet.",
  "skapa en actionlista":
    "Identifiera konkreta åtgärder med ansvarig och deadline om det framgår. Sortera efter prioritet.",
  "identifiera risker":
    "Bedöm sannolikhet och påverkan. Lyft tekniska, organisatoriska och tidsmässiga risker. Föreslå hanteringsåtgärder.",
  "jämföra dokument":
    "Identifiera likheter, skillnader och motsägelser. Lyft fram vad som saknas i det ena men finns i det andra. Notera vilket dokument som verkar mest aktuellt.",

  // Chefsuppgifter
  "skriva medarbetarfeedback":
    "Fokusera på konkreta beteenden och leveranser, inte personlighet. Balansera styrkor och utvecklingsområden. Ge specifika exempel. Håll en konstruktiv och framåtblickande ton.",
  "förbereda ett medarbetarsamtal":
    "Täck följande områden: trivsel och välmående i uppdraget, leverans och kundfeedback, kompetensutveckling och karriärmål, beläggning och uppdragsplanering framåt samt eventuella signaler på vantrivsel eller risk för avhopp.",
  "analysera beläggning och resursplanering":
    "Identifiera konsulter med låg beläggning, kommande luckor och överbelagda resurser. Lyft risker och föreslå omfördelningar eller åtgärder.",
  "skriva ett offertunderlag":
    "Strukturera kring kundens behov, föreslagen lösning, relevanta kompetenser och erfarenheter, kommersiella villkor och nästa steg. Håll det konkret och kundanpassat.",
  "bedöma en kandidat mot ett uppdrag":
    "Jämför kandidatens kompetens, erfarenhet och personlighet mot uppdragets krav och kundens kultur. Lyft styrkor, risker och eventuella gap. Ge en tydlig rekommendation.",
  "skriva en sammanfattning till kund":
    "Fokusera på leverans, status mot plan, avvikelser och nästa steg. Håll en professionell ton anpassad för kundens nivå. Undvik intern jargong.",
  "planera kompetensutveckling":
    "Identifiera gap mot nuvarande eller framtida uppdrag. Föreslå konkreta insatser som kurser, certifieringar eller mentorskap och koppla till konsultens egna mål.",
};

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
  const focus = taskFocus[task];

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
    "Fokusera särskilt på följande:",
    focus,
    "",
    "Svara i formatet: " + outputFormat + ".",
    "",
    closing,
  ];

  return lines.join("\n");
}