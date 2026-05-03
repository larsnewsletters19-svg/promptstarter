import { useState } from "react";
import styles from "./HowItWorks.module.css";

export function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.toggle}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>Hur fungerar det?</span>
        <span className={open ? styles.arrowUp : styles.arrowDown}>▼</span>
      </button>

      {open && (
        <div className={styles.content}>
          <p className={styles.intro}>
            Appen hjälper dig skapa en välformulerad prompt som du sedan
            klistrar in i ditt godkända AI-verktyg, till exempel Copilot.
            All information stannar i din webbläsare – ingenting skickas till
            någon server.
          </p>

          <ol className={styles.steps}>
            <li>
              <strong>Välj din roll</strong> så anpassas promptens ton och
              fokus efter om du är konsult eller konsultchef.
            </li>
            <li>
              <strong>Välj uppgift</strong> och beskriv vad du vill att
              AI:n ska hjälpa dig med.
            </li>
            <li>
              <strong>Välj resultatformat</strong> för hur du vill ha
              svaret presenterat.
            </li>
            <li>
              <strong>Ange underlag</strong> så vet AI:n om du bifogar
              dokument, klistrar in text eller inte har något underlag alls.
            </li>
            <li>
              <strong>Generera och kopiera</strong> prompten och klistra
              in den i ditt godkända AI-verktyg.
            </li>
            <li>
              <strong>Bifoga ditt underlag i AI-verktyget</strong> genom
              att ladda upp dokument eller klistra in text direkt där,
              inte i denna app.
            </li>
          </ol>

          <p className={styles.note}>
            💡 Skriv aldrig in kunddata eller personuppgifter i denna app.
            Underlag hanteras alltid i ditt godkända AI-verktyg.
          </p>
        </div>
      )}
    </div>
  );
}