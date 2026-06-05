import { useState } from "react";
import { SafetyNotice } from "./components/SafetyNotice";
import { RoleSelector } from "./components/RoleSelector";
import { SelectField } from "./components/SelectField";
import { SourceSelector } from "./components/SourceSelector";
import { PromptPreview } from "./components/PromptPreview";
import { PromptAnalyzer } from "./components/PromptAnalyzer";
import { HowItWorks } from "./components/HowItWorks";
import {
  taskGroups,
  outputFormats,
  managerRoles,
} from "./data/options";
import type { Role, Task, OutputFormat, SourceType } from "./data/options";
import { buildPrompt } from "./utils/buildPrompt";
import "./App.css";

type Tab = "skapa" | "analysera";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("skapa");
  const [role, setRole] = useState<Role | "">("");
  const [customRole, setCustomRole] = useState<string>("");
  const [task, setTask] = useState<Task | "">("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat | "">("");
  const [sources, setSources] = useState<SourceType[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  const isManager = role !== "" && managerRoles.includes(role as Role);
  const allSelected = (role || customRole.trim()) && task && outputFormat;

  function handleGenerate() {
    if (!allSelected) return;
    const prompt = buildPrompt({
      role: role as Role,
      customRole,
      task: task as Task,
      outputFormat: outputFormat as OutputFormat,
      sources,
    });
    setGeneratedPrompt(prompt);
  }

  return (
    <div className="app">
      <header className="appHeader">
        <h1 className="appTitle">Promptstarter för AI</h1>
        <p className="appDescription">
          Skapa en prompt här. Kopiera den sedan till ditt godkända AI-verktyg,
          till exempel Copilot.
        </p>
      </header>

      <main className="container">
        <HowItWorks />
        <SafetyNotice isManager={isManager} />

        {/* Flikar */}
        <div className="tabs">
          <button
            className={activeTab === "skapa" ? "tab tabActive" : "tab"}
            onClick={() => setActiveTab("skapa")}
          >
            Skapa prompt
          </button>
          <button
            className={activeTab === "analysera" ? "tab tabActive" : "tab"}
            onClick={() => setActiveTab("analysera")}
          >
            Förbättra din prompt
          </button>
        </div>

        {/* Skapa prompt */}
        {activeTab === "skapa" && (
          <>
            <section className="formCard">
              <div className="formGrid">
                <RoleSelector
                  value={role}
                  customRole={customRole}
                  onRoleChange={(v) => { setRole(v); setGeneratedPrompt(""); }}
                  onCustomRoleChange={(v) => { setCustomRole(v); setGeneratedPrompt(""); }}
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

            {generatedPrompt && (
              <section aria-label="Genererad prompt">
                <PromptPreview prompt={generatedPrompt} />
              </section>
            )}
          </>
        )}

        {/* Analysera prompt */}
        {activeTab === "analysera" && (
          <section aria-label="Analysera prompt">
            <PromptAnalyzer />
          </section>
        )}
      </main>
    </div>
  );
}