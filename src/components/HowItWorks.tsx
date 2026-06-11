import { useState } from "react";
import styles from "./HowItWorks.module.css";

interface HowItWorksProps {
  variant?: "skapa" | "analysera" | "visual";
}

export function HowItWorks({ variant = "skapa" }: HowItWorksProps) {
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

          {variant === "skapa" && (
            <>
              <p className={styles.intro}>
                Appen hjälper dig skapa en välformulerad prompt som du sedan
                klistrar in i ditt godkända AI-verktyg, till exempel Copilot.
                All information stannar i din webbläsare – ingenting skickas till
                någon server.
              </p>
              <ol className={styles.steps}>
                <li><strong>Välj din roll</strong> så anpassas promptens ton och fokus efter om du är konsult eller konsultchef.</li>
                <li><strong>Välj uppgift</strong> och beskriv vad du vill att AI:n ska hjälpa dig med.</li>
                <li><strong>Välj resultatformat</strong> för hur du vill ha svaret presenterat.</li>
                <li><strong>Ange underlag</strong> så vet AI:n om du bifogar dokument, klistrar in text eller inte har något underlag alls.</li>
                <li><strong>Generera och kopiera</strong> prompten och klistra in den i ditt godkända AI-verktyg.</li>
                <li><strong>Bifoga ditt underlag i AI-verktyget</strong> genom att ladda upp dokument eller klistra in text direkt där, inte i denna app.</li>
              </ol>
              <p className={styles.note}>
                💡 Skriv aldrig in kunddata eller personuppgifter i denna app. Underlag hanteras alltid i ditt godkända AI-verktyg.
              </p>
            </>
          )}

          {variant === "analysera" && (
            <>
              <p className={styles.intro}>
                Har du en prompt som inte riktigt ger de svar du vill ha? Den här fliken hjälper dig förbättra den.
              </p>
              <ol className={styles.steps}>
                <li><strong>Klistra in din prompt</strong> – antingen en du skrivit själv eller en du skapat i appen.</li>
                <li><strong>Generera analysprompt</strong> så skapar appen en prompt som ber AI:n granska din.</li>
                <li><strong>Kopiera och klistra in</strong> analyspromptens i Claude, Copilot eller ChatGPT.</li>
                <li><strong>Få en fullständig analys</strong> med förbättrad version och förklaring av varje del.</li>
              </ol>
              <p className={styles.note}>
                💡 Klistra aldrig in kunddata eller känslig information i prompten här.
              </p>
            </>
          )}

          {variant === "visual" && (
            <>
              <p className={styles.intro}>
                Förvandla vilket ämne som helst till en interaktiv visual. Perfekt när du vill förstå något på djupet, förklara för andra eller jämföra alternativ.
              </p>
              <ol className={styles.steps}>
                <li><strong>Skriv in ett ämne</strong> – vad som helst, från DORA till kvantfysik.</li>
                <li><strong>Generera prompt</strong> så skapar appen en färdig prompt åt dig.</li>
                <li><strong>Kopiera och klistra in</strong> i Claude (gratisversionen fungerar – ChatGPT funkar också men inte lika bra).</li>
                <li><strong>Claude gör resten automatiskt</strong> – brainstormar 5 visuella alternativ, väljer de 2 bästa och bygger en interaktiv visual.</li>
                <li><strong>Dela resultatet</strong> genom att klicka på Publicera i Claude – alla kan se det utan Claude-konto.</li>
              </ol>
              <p className={styles.note}>
                💡 Undvik ämnen som innehåller kunddata eller känslig information.
              </p>
            </>
          )}

        </div>
      )}
    </div>
  );
}
