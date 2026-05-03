import styles from "./SafetyNotice.module.css";

interface SafetyNoticeProps {
  // isManager styr om notisen gäller persondata eller kunddata
  isManager: boolean;
}

export function SafetyNotice({ isManager }: SafetyNoticeProps) {
  const message = isManager
    ? "Skriv inte in personuppgifter eller känslig personaldata i denna app. Bifoga dokument i er godkända AI-miljö."
    : "Skriv inte in kunddata i denna app. Kunddokument ska endast bifogas i kundens godkända AI-miljö.";

  return (
    <div className={styles.notice} role="alert">
      <span className={styles.icon}>⚠️</span>
      <p>{message}</p>
    </div>
  );
}