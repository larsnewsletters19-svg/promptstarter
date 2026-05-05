import type { Role, Task, OutputFormat, SourceType } from "../data/options";
import { managerRoles } from "../data/options";

interface PromptInputs {
  role: Role;
  customRole: string;
  task: Task;
  outputFormat: OutputFormat;
  sources: SourceType[];
}

function isManagerRole(role: Role): boolean {
  return managerRoles.includes(role);
}

const taskFocus: Record<Task, string> = {
  "analysera dokumentet":
    "Identifiera syfte, scope och målgrupp. Lyft fram det som är oklart, motsägelsefullt eller saknas. Notera antaganden som dokumentet bygger på.",
  "hitta öppna frågor":
    "Leta efter beslut som inte är tagna, krav som är vaga, ansvarsområden som är otydliga och beroenden som inte är lösta.",
  "förbättra kraven":
    "Kontrollera att varje krav är mätbart, testbart och entydigt. Identifiera krav som överlappar, saknas eller är för tekniska eller för vaga.",
  "skapa testfall":
    "Täck lyckliga flöden, felflöden och gränsfall. Varje testfall ska ha förutsättning, steg och förväntat resultat.",
  "identifiera risker":
    "Bedöm sannolikhet och påverkan. Lyft tekniska, organisatoriska och tidsmässiga risker. Föreslå hanteringsåtgärder.",
  "jämföra dokument":
    "Identifiera likheter, skillnader och motsägelser. Lyft fram vad som saknas i det ena men finns i det andra. Notera vilket dokument som verkar mest aktuellt.",
  "skriva ett dokument":
    "Strukturera innehållet logiskt med tydlig inledning, kärna och avslutning. Anpassa språk och ton efter målgruppen. Var konkret och undvik onödig jargong.\nLeverera: Förslag på rubrik + dokumentets innehåll.",
  "skriva ett brev eller mejl":
    "Inled med syftet. Presentera kärnan tydligt och konkret. Anpassa tonen efter mottagaren. Avsluta med en tydlig uppmaning, fråga eller nästa steg.\nLeverera: Förslag på ämnesrad + färdigt brev eller mejl.",
  "skriva en presentation":
    "Strukturera med en tydlig röd tråd. Varje bild ska ha ett budskap. Inled med varför det är relevant och avsluta med nästa steg eller slutsats.\nLeverera: Förslag på rubrik + bildstruktur med en mening per bild.",
  "skriva en kravspecifikation":
    "Varje krav ska vara mätbart, testbart och entydigt. Separera funktionella krav från icke-funktionella. Inkludera syfte, scope och avgränsningar.\nLeverera: Förslag på rubrik + versionsnummer + innehållsförteckning + krav.",
  "skriva en sammanfattning till kund":
    "Fokusera på leverans, status mot plan, avvikelser och nästa steg. Håll en professionell ton anpassad för kundens nivå. Undvik intern jargong.\nLeverera: Förslag på rubrik + datum + sammanfattning.",
  "sammanfatta innehållet":
    "Lyft fram syfte, viktigaste beslut, åtaganden och nästa steg. Håll det kort och läsbart för en person som inte läst dokumentet.",
  "skapa en actionlista":
    "Identifiera konkreta åtgärder med ansvarig och deadline om det framgår. Sortera efter prioritet.",
  "strukturera om innehållet":
    "Identifiera den logiska ordningen för innehållet. Gruppera relaterade delar, ta bort upprepningar och säkerställ att det finns en tydlig röd tråd.",
  "översätta till enklare språk":
    "Ersätt facktermer med vardagliga ord där det är möjligt. Korta ner meningar. Behåll det viktiga innehållet men gör det tillgängligt för en bredare målgrupp.",
  "korrekturläsa och förbättra texten":
    "Rätta språkliga fel och förbättra meningsbyggnad och flöde. Lyft fram delar som är otydliga eller kan missförstås. Behåll författarens ton och intentioner.",
  "skriva medarbetarfeedback":
    "Fokusera på konkreta beteenden och leveranser, inte personlighet. Balansera styrkor och utvecklingsområden. Ge specifika exempel. Håll en konstruktiv och framåtblickande ton.",
  "förbereda ett medarbetarsamtal":
    "Täck följande områden: trivsel och välmående i uppdraget, leverans och kundfeedback, kompetensutveckling och karriärmål, beläggning och uppdragsplanering framåt samt eventuella signaler på vantrivsel eller risk för avhopp.",
  "analysera beläggning och resursplanering":
    "Identifiera konsulter med låg beläggning, kommande luckor och överbelagda resurser. Lyft risker och föreslå omfördelningar eller åtgärder.",
  "skriva ett offertunderlag":
    "Strukturera kring kundens behov, föreslagen lösning, relevanta kompetenser och erfarenheter, kommersiella villkor och nästa steg. Håll det konkret och kundanpassat.\nLeverera: Förslag på rubrik + offertstruktur.",
  "bedöma en kandidat mot ett uppdrag":
    "Jämför kandidatens kompetens, erfarenhet och personlighet mot uppdragets krav och kundens kultur. Lyft styrkor, risker och eventuella gap. Ge en tydlig rekommendation.",
  "planera kompetensutveckling":
    "Identifiera gap mot nuvarande eller framtida uppdrag. Föreslå konkreta insatser som kurser, certifieringar eller mentorskap och koppla till konsultens egna mål.",
};

const TEXT_PLACEHOLDER = "\n[Klistra in ditt underlag här]";

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
  customRole,
  task,
  outputFormat,
  sources,
}: PromptInputs): string {
  const isManager = isManagerRole(role);
  const hasInklistradText = sources.includes("inklistrad text");

  const effectiveRole = typeof customRole === "string" && customRole.trim() ? customRole.trim() : String(role);

  const intro = isManager
    ? "Agera som en erfaren " + effectiveRole + " på ett IT-konsultbolag."
    : effectiveRole === "Generell"
    ? "Agera som en erfaren yrkesperson med relevant kompetens för uppgiften."
    : "Agera som en senior " + effectiveRole + ".";
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
    ...(hasInklistradText ? [TEXT_PLACEHOLDER] : []),
  ];

  return lines.join("\n");
}