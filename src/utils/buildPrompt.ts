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
  "analysera dokumentet": `Gör en strukturerad analys i tre delar:

1. Översikt – Vad är dokumentets syfte, scope och målgrupp? Vad försöker det uppnå?
2. Innehållsanalys – Vad säger dokumentet? Sammanfatta de viktigaste delarna utan att värdera.
3. Kritisk granskning – Vad är oklart, motsägelsefullt eller saknas helt? Vilka antaganden bygger dokumentet på som inte är uttalade? Vad riskerar att misstolkas?

Markera tydligt skillnaden mellan vad som står i dokumentet och vad som är din analys.`,

  "hitta öppna frågor": `Gå igenom underlaget systematiskt och identifiera:

1. Obesvarade beslut – Vad behöver beslutas men är inte beslutat?
2. Vaga krav eller beskrivningar – Vad är formulerat för otydligt för att kunna agera på?
3. Otydliga ansvar – Vem äger vad? Var saknas tydlig ägare?
4. Olösta beroenden – Vad hänger på något annat som inte är klart?
5. Saknad information – Vad behöver man veta men som inte finns i underlaget?

Presentera varje öppen fråga med: Fråga / Varför den är kritisk / Föreslagen nästa åtgärd.`,

  "förbättra kraven": `Gå igenom varje krav och bedöm det mot följande kriterier:

- Mätbart: Kan man avgöra om kravet är uppfyllt?
- Testbart: Kan man skriva ett testfall för det?
- Entydigt: Kan det tolkas på mer än ett sätt?
- Nödvändigt: Tillför det verkligt värde eller är det nice-to-have?
- Konsistent: Motsäger det något annat krav?

För varje krav som brister – föreslå en konkret förbättrad formulering.
Identifiera även krav som saknas helt baserat på kontexten.`,

  "skapa testfall": `Skapa testfall som täcker:

1. Lyckliga flöden – Det som ska fungera när allt är rätt
2. Felflöden – Det som ska hanteras när något är fel
3. Gränsfall – Extremvärden, tomma fält, maximala mängder
4. Behörighetskontroller – Rätt person gör rätt sak

Varje testfall ska ha:
- ID och namn
- Förutsättning (vad som måste vara sant innan testet körs)
- Teststeg (numrerade, konkreta handlingar)
- Förväntat resultat (exakt vad som ska hända)
- Prioritet (Hög/Medium/Låg)`,

  "identifiera risker": `Identifiera risker inom följande kategorier:

1. Tekniska risker – Komplexitet, beroenden, okänd teknik, integration
2. Organisatoriska risker – Resurser, kompetens, beslutsfattande, förankring
3. Tidsmässiga risker – Orealistiska deadlines, beroenden till externa parter
4. Affärsmässiga risker – Ändrade krav, budgetosäkerhet, kundens mognad

För varje risk:
- Beskriv risken konkret
- Bedöm sannolikhet (Hög/Medium/Låg)
- Bedöm påverkan (Hög/Medium/Låg)
- Föreslå en hanteringsåtgärd`,

  "jämföra dokument": `Gör en strukturerad jämförelse:

1. Gemensamt innehåll – Vad beskriver båda dokumenten på liknande sätt?
2. Skillnader – Var avviker de från varandra? Är skillnaderna avsiktliga eller motstridiga?
3. Luckor – Vad finns i det ena men saknas i det andra?
4. Motsägelser – Var säger de direkt emot varandra?
5. Aktualitet – Vilket dokument verkar mest uppdaterat och varför?

Avsluta med en rekommendation: Vilket dokument bör användas som grund, och vad behöver sammanföras från det andra?`,

  "skriva ett dokument": `Arbeta i följande ordning:

1. Analysera syftet – Vad ska dokumentet uppnå? Vem är mottagaren och vad behöver de veta?
2. Föreslå struktur – Presentera en innehållsförteckning och motivera varje avsnitt kort.
3. Skriv dokumentet – Följ strukturen. Inled varje avsnitt med det viktigaste. Undvik jargong.
4. Kvalitetskontroll – Kontrollera att varje avsnitt bidrar till syftet och att dokumentet hänger ihop.

Leverera: Förslag på rubrik + innehållsförteckning + fullständigt dokument.`,

  "skriva ett brev eller mejl": `Tänk igenom följande innan du skriver:
- Vad är det enda budskapet mottagaren ska ta med sig?
- Vilken ton passar relationen och situationen?
- Vad är den önskade reaktionen eller åtgärden?

Struktur:
1. Inled med syftet – Vad handlar detta om och varför är det relevant för mottagaren?
2. Kärnan – Presentera fakta, bakgrund eller erbjudande konkret och kortfattat.
3. Avslut – Tydlig uppmaning, fråga eller nästa steg. Vem gör vad och när?

Leverera: Förslag på ämnesrad + färdigt brev eller mejl.`,

  "skriva en presentation": `Arbeta fram presentationen i tre steg:

1. Budskap – Vad är det enda budskapet publiken ska minnas? Formulera det i en mening.
2. Struktur – Bygg en bildstruktur med: Varför är detta relevant? → Vad är situationen? → Vad föreslår vi? → Vad händer nu?
3. Bildinnehåll – Varje bild har ett budskap i rubriken. Innehållet stödjer rubriken, inte tvärtom.

Undvik: Punktlistor med mer än 4 punkter, text under 20pt, bilder utan syfte.

Leverera: Budskapet i en mening + bildstruktur med rubrik och en mening innehåll per bild.`,

  "skriva en kravspecifikation": `Arbeta strukturerat i följande ordning:

1. Förstå underlaget – Identifiera affärsmål, intressenter och scope från det bifogade materialet.
2. Strukturera kravspecen – Använd denna struktur:
   - Syfte och bakgrund
   - Scope och avgränsningar
   - Intressenter och roller
   - Funktionella krav (numrerade, en rad per krav)
   - Icke-funktionella krav (prestanda, säkerhet, tillgänglighet)
   - Beroenden och antaganden
   - Öppna frågor

3. Formulera kraven – Varje krav ska vara: mätbart, testbart, entydigt och nödvändigt.
   Använd formatet: "Systemet ska [verb] [objekt] [villkor/mått]."

4. Markera luckor – Om underlaget inte räcker för att skriva ett komplett krav, markera det tydligt med [SAKNAS: beskriv vad som behövs].

Leverera: Rubrik + versionsnummer + datum + fullständig kravspecifikation enligt strukturen ovan.`,

  "skriva en sammanfattning till kund": `En kundsummering ska vara tydlig, ärlig och handlingsorienterad. Tänk: vad behöver kunden veta – inte vad vill vi berätta?

Struktur:
1. Status i ett stycke – Hur går det, kort och ärligt?
2. Leveranser sedan senast – Vad har gjorts? Håll det konkret.
3. Avvikelser och risker – Vad är försenat, riskerar att bli fel eller kräver ett beslut?
4. Nästa steg – Vad händer nu och vem ansvarar för vad?

Ton: Professionell men direkt. Undvik konsultjargong. Skriv som om kunden inte har tid att läsa mer än 2 minuter.

Leverera: Rubrik + datum + sammanfattning enligt strukturen.`,

  "sammanfatta innehållet": `Skriv en sammanfattning för någon som inte läst underlaget och inte har tid att läsa det nu.

Täck:
1. Vad handlar det om? (1–2 meningar)
2. Viktigaste beslut eller slutsatser
3. Åtaganden – Vem ska göra vad?
4. Nästa steg och deadlines

Max längd: Anpassa efter underlagets längd, men aldrig mer än 20% av originalet.
Markera om något verkar viktigt men är otydligt formulerat i originalet.`,

  "skapa en actionlista": `Gå igenom underlaget och extrahera alla åtaganden, beslut och nästa steg.

För varje åtgärd, ange:
- Vad ska göras? (konkret och tydligt)
- Vem ansvarar? (om det framgår)
- När ska det vara klart? (om det framgår)
- Prioritet (Hög / Medium / Låg)

Sortera efter prioritet. Om ansvar eller deadline inte framgår – markera som [Okänt] och lägg till som öppen fråga i slutet.`,

  "strukturera om innehållet": `Analysera först det befintliga innehållet:
- Vad är den röda tråden – eller varför saknas den?
- Vilka delar hör ihop och är separerade?
- Vad upprepas i onödan?
- Vad saknas för att helheten ska fungera?

Föreslå sedan en ny struktur med motivering.
Skriv om innehållet enligt den nya strukturen utan att tappa viktig information.
Markera om något behöver kompletteras av användaren.`,

  "översätta till enklare språk": `Gå igenom texten och gör följande:

1. Ersätt facktermer – Förklara eller byt ut termer som en icke-specialist inte förstår.
2. Korta meningar – Dela upp meningar med fler än 25 ord.
3. Aktiv form – Skriv "vi skickar" istället för "utskick sker av".
4. Ta bort onödigt – Ta bort meningar som inte tillför information.
5. Behåll budskapet – Förenkla språket, inte innehållet.

Leverera den omskrivna texten och markera de 3 största förändringarna du gjorde.`,

  "korrekturläsa och förbättra texten": `Gör en genomgång i två pass:

Pass 1 – Språk och form:
- Stavning och grammatik
- Meningsbyggnad och flöde
- Konsekvent terminologi och stil

Pass 2 – Klarhet och effekt:
- Finns det meningar som kan missförstås?
- Finns det onödiga upprepningar?
- Är strukturen logisk – kommer rätt sak i rätt ordning?

Leverera: Den korrigerade texten + en kort lista med de viktigaste förbättringarna du gjorde och varför.`,

  "skriva medarbetarfeedback": `Feedback ska vara konkret, balanserad och framåtblickande. Undvik generaliseringar.

Struktur:
1. Styrkor – Vad har personen levererat väl? Ge konkreta exempel på beteenden eller resultat.
2. Utvecklingsområden – Vad behöver förbättras? Fokusera på beteenden, inte personlighet.
3. Framåt – Vad är nästa steg för den här personen? Vad kan de göra annorlunda?

Ton: Konstruktiv och respektfull. Skriv som om personen läser detta.
Undvik: "Du är bra på..." – skriv istället "I [situation] visade du [beteende] vilket ledde till [resultat]."`,

  "förbereda ett medarbetarsamtal": `Skapa ett underlag för ett strukturerat medarbetarsamtal med följande områden:

1. Trivsel och välmående – Hur mår personen i uppdraget? Vad fungerar bra, vad är tungt?
2. Leverans och kundfeedback – Hur bedömer vi prestationen? Vad har kunden sagt?
3. Kompetensutveckling – Vad vill personen lära sig? Vad behöver vi att de lär sig?
4. Karriär och mål – Vart vill personen? Hur kan vi stödja det?
5. Beläggning och planering – Hur ser närmaste tid ut? Finns det risker eller möjligheter?
6. Signaler att följa upp – Finns det tecken på vantrivsel, stress eller risk för avhopp?

Leverera förslag på konkreta samtalsfrågor per område.`,

  "analysera beläggning och resursplanering": `Analysera underlaget och identifiera:

1. Kritiska lägen nu – Vem är underbelagd idag? Vem är överbelagd?
2. Kommande risker – Var uppstår luckor eller toppar inom 30–90 dagar?
3. Kompetensgap – Finns uppdrag som saknar rätt profil?
4. Åtgärdsförslag – Konkreta omfördelningar, rekryteringsbehov eller kunddialoger som bör initieras.

Presentera i tabellform om möjligt. Avsluta med en prioriterad lista över de tre mest akuta åtgärderna.`,

  "skriva ett offertunderlag": `Ett bra offertunderlag visar att vi förstår kundens problem bättre än de gör själva.

Struktur:
1. Kundens situation och behov – Vad är utmaningen? Varför är det viktigt att lösa den nu?
2. Vår föreslagna lösning – Hur löser vi det? Vad är vår approach?
3. Varför vi – Relevanta erfarenheter, kompetenser och referenser.
4. Genomförande – Hur ser upplägg, faser och tidplan ut?
5. Kommersiellt – Pris, modell och villkor.
6. Nästa steg – Vad händer nu och vem gör vad?

Ton: Kundcentrerad. Börja alltid med kundens perspektiv, inte med vad vi erbjuder.

Leverera: Rubrik + offertstruktur med innehåll per avsnitt.`,

  "bedöma en kandidat mot ett uppdrag": `Gör en strukturerad matchningsbedömning:

1. Kravmatchning – Hur väl matchar kandidatens kompetens och erfarenhet uppdragets krav? (Möter / Möter delvis / Möter inte – per krav)
2. Kulturell passning – Hur väl matchar kandidatens arbetssätt och personlighet kundens kultur och team?
3. Styrkor i kontexten – Vad tillför kandidaten som är särskilt värdefullt för just det här uppdraget?
4. Risker och gap – Vad saknas? Vad kan bli svårt?
5. Rekommendation – Ja / Nej / Ja med reservationer – med tydlig motivering.

Var ärlig. En tydlig nej-rekommendation är mer värdefull än en vag ja.`,

  "planera kompetensutveckling": `Arbeta fram en konkret utvecklingsplan:

1. Nuläge – Vad kan personen idag? Vad används i nuvarande uppdrag?
2. Målbild – Vad behöver personen kunna? Koppla till kommande uppdrag eller karriärmål.
3. Gap – Vad är skillnaden mellan nuläge och målbild?
4. Insatser – För varje gap, föreslå konkret åtgärd:
   - Kurs eller certifiering (med namn och leverantör om möjligt)
   - Mentorskap eller shadowing
   - Praktisk träning i befintligt uppdrag
5. Tidplan – När ska vad vara klart?
6. Uppföljning – Hur och när mäter vi framsteg?`,
};

const TEXT_PLACEHOLDER = "\n[Klistra in ditt underlag här]";

function buildSourceSection(sources: SourceType[]): string {
  const hasDokument = sources.includes("dokument");
  const hasText = sources.includes("inklistrad text");

  if (hasDokument && hasText) {
    return `Underlag: Jag bifogar dokument och klistrar in text i denna session.
Använd ENDAST detta underlag som grund för svaret.
Gör inga antaganden som inte stöds av underlaget – markera tydligt om något saknas.`;
  }
  if (hasDokument) {
    return `Underlag: Jag bifogar dokument i denna session.
Använd ENDAST dessa dokument som grund för svaret.
Gör inga antaganden som inte stöds av dokumenten – markera tydligt om något saknas.`;
  }
  if (hasText) {
    return `Underlag: Text följer efter denna prompt.
Använd ENDAST denna text som grund för svaret.
Gör inga antaganden som inte stöds av texten – markera tydligt om något saknas.`;
  }
  return `Underlag: Inget dokument eller text har angetts.
Basera inte svaret på antaganden.
Ställ istället 3–5 konkreta klargörande frågor som du behöver svar på för att lösa uppgiften väl.`;
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
  const isWordOutput = outputFormat === "Word-dokument" || outputFormat === "Word-dokument enligt bifogad mall";
  const hasWordMall = sources.includes("word-mall") || outputFormat === "Word-dokument enligt bifogad mall";

  const effectiveRole =
    typeof customRole === "string" && customRole.trim()
      ? customRole.trim()
      : String(role);

  const intro = isManager
    ? `Agera som en erfaren ${effectiveRole} på ett IT-konsultbolag. Du har djup erfarenhet av att leda konsulter, hantera kundrelationer och driva affär.`
    : effectiveRole === "Generell"
    ? "Agera som en erfaren yrkesperson med relevant kompetens för uppgiften nedan."
    : `Agera som en senior ${effectiveRole} med gedigen erfarenhet från komplexa IT-uppdrag hos enterprise-kunder.`;

  const sourceSection = buildSourceSection(sources);
  const focus = taskFocus[task];

  const thinkStep = `Innan du svarar – tänk igenom:
- Vad är det egentliga syftet med uppgiften?
- Vem är mottagaren och vad behöver de?
- Vad är det viktigaste att få rätt?`;

  const closing = isManager
    ? `Kvalitetskontroll innan du levererar:
1. Är svaret praktiskt användbart för en konsultchef i vardagen?
2. Är tonen professionell och konstruktiv?
3. Är alla antaganden tydligt markerade?
4. Är allt som saknas eller är oklart tydligt markerat?`
    : `Kvalitetskontroll innan du levererar:
1. Bygger svaret på det angivna underlaget – inte på antaganden?
2. Är alla antaganden tydligt markerade?
3. Är saknad information tydligt markerad?
4. Är svaret praktiskt användbart för en konsult i ett kunduppdrag?`;

  const lines = [
    intro,
    "",
    thinkStep,
    "",
    sourceSection,
    "",
    `Din uppgift är att ${task}.`,
    "",
    "Så här ska du arbeta:",
    focus,
    "",
    `Svara i formatet: ${outputFormat}.`,
    "",
    closing,
    ...(hasInklistradText ? [TEXT_PLACEHOLDER] : []),
    ...(isWordOutput ? [buildWordInstructions(hasWordMall)] : []),
  ];

  return lines.join("\n");
}

// Word-artifact instruktioner – läggs till i slutet av prompten
export function buildWordInstructions(hasMall: boolean): string {
  if (hasMall) {
    return `
## Leverera som Word-dokument
Skapa svaret som en artifact i form av ett Word-dokument (.docx).
En Word-mall är bifogad i sessionen – följ mallens struktur, rubriker och formatering exakt.
Behåll mallens typsnitt, rubriknivåer och layout. Fyll i innehållet utan att ändra mallens utseende.`;
  }
  return `
## Leverera som Word-dokument
Skapa svaret som en artifact i form av ett Word-dokument (.docx).
Använd ett professionellt standardformat med:
- Tydliga rubriknivåer (Rubrik 1, Rubrik 2)
- Brödtext i läsbart typsnitt
- Sidhuvud med dokumenttitel och datum
- Sidfot med sidnummer`;
}
