import type { SourceType } from "../data/options";
import { sourceTypes } from "../data/options";
import styles from "./SourceSelector.module.css";

interface SourceSelectorProps {
  selected: SourceType[];
  onChange: (selected: SourceType[]) => void;
}

export function SourceSelector({ selected, onChange }: SourceSelectorProps) {
  function handleChange(value: SourceType) {
    // Toggla – lägg till om den inte finns, ta bort om den finns
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div className={styles.container}>
      <p className={styles.label}>Underlag i AI-sessionen</p>
      <div className={styles.options}>
        {sourceTypes.map((source) => (
          <label key={source.value} className={styles.option}>
            <input
              type="checkbox"
              checked={selected.includes(source.value)}
              onChange={() => handleChange(source.value)}
              className={styles.checkbox}
            />
            <span className={styles.optionLabel}>{source.label}</span>
          </label>
        ))}
      </div>

      {/* Varning om inget underlag valts */}
      {selected.length === 0 && (
        <p className={styles.warning} role="alert">
          ⚠️ Inget underlag valt. Prompten instruerar AI:n att ställa klargörande frågor istället för att gissa.
        </p>
      )}
    </div>
  );
}