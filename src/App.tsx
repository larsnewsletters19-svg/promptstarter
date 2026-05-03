import { useState } from "react";
import { HowItWorks } from "./components/HowItWorks";
import { SafetyNotice } from "./components/SafetyNotice";
import { SelectField } from "./components/SelectField";
import { SourceSelector } from "./components/SourceSelector";
import { PromptPreview } from "./components/PromptPreview";
import {
  roleGroups,
  taskGroups,
  outputFormats,
  managerRoles,
} from "./data/options";
import type { Role, Task, OutputFormat, SourceType } from "./data/options";
import { buildPrompt } from "./utils/buildPrompt";
import "./App.css";

export default function App() {
  const [role, setRole] = useState<Role | "">("");
  const [task, setTask] = useState<Task | "">("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat | "">("");
  const [sources, setSources] = useState<SourceType[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  // Avgör om vald roll är en chefsroll – styr säkerhetsnotis och promptlogik
  const isManager = role !== "" && managerRoles.includes(role as Role);

  const allSelected = role && task && outputFormat;

  function handleGenerate() {
    if (!allSelected) return;
    const prompt = buildPrompt({
      role: role as Role,
      task: task as Task,
      outputFormat: outputFormat as OutputFormat,
      sources,
    });
    setGeneratedPrompt(prompt);
  }

  return (
    <div className="app">
      <main className="container">
        <header className="appHeader">
          <h1 className="appTitle">Promptstarter för AI</h1>
          <p className="appDescription">
            Skapa en prompt här. Kopiera den sedan till ditt godkända AI-verktyg,
            till exempel Copilot.
          </p>
        </header>
        <HowItWorks />

        {/* Säkerhetsnotis – uppdateras automatiskt när chefsroll väljs */}
        <SafetyNotice isManager={isManager} />

        <section className="formCard">
          <div className="formGrid">
            <SelectField
              label="Roll"
              id="role"
              value={role}
              onChange={(v) => { setRole(v); setGeneratedPrompt(""); }}
              groups={roleGroups}
              placeholder="Välj din roll..."
            />
            <SelectField
              label="Uppgift"
              id="task"
              value={task}
              onChange={(v) => { setTask(v); setGeneratedPrompt(""); }}
              groups={taskGroups}
              placeholder="Välj uppgift..."
            />
            <SelectField
              label="Resultatformat"
              id="outputFormat"
              value={outputFormat}
              onChange={(v) => { setOutputFormat(v); setGeneratedPrompt(""); }}
              options={outputFormats}
              placeholder="Välj format..."
            />
          </div>

          {/* Underlagsväljare – checkboxar */}
          <SourceSelector
            selected={sources}
            onChange={(v) => { setSources(v); setGeneratedPrompt(""); }}
          />

          <button
            className="generateButton"
            onClick={handleGenerate}
            disabled={!allSelected}
          >
            Generera prompt
          </button>
        </section>

        {/* Prompten visas när den är genererad */}
        {generatedPrompt && (
          <section aria-label="Genererad prompt">
            <PromptPreview prompt={generatedPrompt} />
          </section>
        )}
      </main>
    </div>
  );
}