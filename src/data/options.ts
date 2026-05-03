// Alla valbara alternativ för dropdowns.
// Konsultroller och chefsroller samlas i samma Roll-lista.

export type Role =
  | "Business Analyst"
  | "Product Owner"
  | "Scrum Master"
  | "Project Manager"
  | "Test Analyst"
  | "Agile Coach"
  | "Solution Architect"
  | "Konsultchef"
  | "Delivery Manager"
  | "Account Manager"
  | "HR Business Partner";

export type Task =
  | "analysera dokumentet"
  | "hitta öppna frågor"
  | "förbättra kraven"
  | "skapa testfall"
  | "sammanfatta innehållet"
  | "skapa en actionlista"
  | "identifiera risker"
  | "jämföra dokument"
  | "skriva ett dokument"
  | "skriva ett brev eller mejl"
  | "skriva en presentation"
  | "skriva en kravspecifikation"
  | "strukturera om innehållet"
  | "översätta till enklare språk"
  | "korrekturläsa och förbättra texten"
  | "skriva medarbetarfeedback"
  | "förbereda ett medarbetarsamtal"
  | "analysera beläggning och resursplanering"
  | "skriva ett offertunderlag"
  | "bedöma en kandidat mot ett uppdrag"
  | "skriva en sammanfattning till kund"
  | "planera kompetensutveckling";

export type DocumentType =
  | "kravdokument"
  | "mötesanteckningar"
  | "processbeskrivning"
  | "testdokument"
  | "PowerPoint"
  | "Excel"
  | "Jira-export"
  | "annat dokument"
  | "tidrapporter"
  | "projektrapport från kund"
  | "CV / profildokument"
  | "beläggningsrapport"
  | "kandidatpresentation"
  | "offertförfrågan (RFP)"
  | "prestationsfeedback"
  | "annat internt dokument";

export type OutputFormat =
  | "tabell"
  | "punktlista"
  | "löpande text"
  | "enligt bifogad mall"
  | "executive summary"
  | "frågor till business"
  | "testfall"
  | "risklista"
  | "actionlista"
  | "acceptanskriterier"
  | "sammanfattning"
  | "feedbacktext"
  | "offertstruktur"
  | "rekommendation";


export const roleGroups: { label: string; options: Role[] }[] = [
  {
    label: "Konsultroller",
    options: [
      "Business Analyst",
      "Product Owner",
      "Scrum Master",
      "Project Manager",
      "Test Analyst",
      "Agile Coach",
      "Solution Architect",
    ],
  },
  {
    label: "Chefsroller",
    options: [
      "Konsultchef",
      "Delivery Manager",
      "Account Manager",
      "HR Business Partner",
    ],
  },
];

export const taskGroups: { label: string; options: Task[] }[] = [
  {
    label: "Analysera och granska",
    options: [
      "analysera dokumentet",
      "hitta öppna frågor",
      "förbättra kraven",
      "skapa testfall",
      "identifiera risker",
      "jämföra dokument",
    ],
  },
  {
    label: "Skriva och producera",
    options: [
      "skriva ett dokument",
      "skriva ett brev eller mejl",
      "skriva en presentation",
      "skriva en kravspecifikation",
      "skriva en sammanfattning till kund",
    ],
  },
  {
    label: "Bearbeta och strukturera",
    options: [
      "sammanfatta innehållet",
      "skapa en actionlista",
      "strukturera om innehållet",
      "översätta till enklare språk",
      "korrekturläsa och förbättra texten",
    ],
  },
  {
    label: "Chefsuppgifter",
    options: [
      "skriva medarbetarfeedback",
      "förbereda ett medarbetarsamtal",
      "analysera beläggning och resursplanering",
      "skriva ett offertunderlag",
      "bedöma en kandidat mot ett uppdrag",
      "planera kompetensutveckling",
    ],
  },
];
export const documentTypeGroups: { label: string; options: DocumentType[] }[] = [
  {
    label: "Kunduppdrag",
    options: [
      "kravdokument",
      "mötesanteckningar",
      "processbeskrivning",
      "testdokument",
      "PowerPoint",
      "Excel",
      "Jira-export",
      "annat dokument",
    ],
  },
  {
    label: "Interna dokument",
    options: [
      "tidrapporter",
      "projektrapport från kund",
      "CV / profildokument",
      "beläggningsrapport",
      "kandidatpresentation",
      "offertförfrågan (RFP)",
      "prestationsfeedback",
      "annat internt dokument",
    ],
  },
];

export const outputFormats: OutputFormat[] = [
  "löpande text",
  "enligt bifogad mall",
  "tabell",
  "punktlista",
  "executive summary",
  "frågor till business",
  "testfall",
  "risklista",
  "actionlista",
  "acceptanskriterier",
  "sammanfattning",
  "feedbacktext",
  "offertstruktur",
  "rekommendation",
];

// Används för att avgöra om vald roll är en chefsroll
export const managerRoles: Role[] = [
  "Konsultchef",
  "Delivery Manager",
  "Account Manager",
  "HR Business Partner",
];
// Underlagstyper – kan kombineras
export type SourceType = "dokument" | "inklistrad text";

export const sourceTypes: { value: SourceType; label: string }[] = [
  { value: "dokument", label: "Jag bifogar dokument" },
  { value: "inklistrad text", label: "Jag klistrar in text som underlag" },
];