import styles from "./SelectField.module.css";

interface OptionGroup<T extends string> {
  label: string;
  options: T[];
}

interface SelectFieldProps<T extends string> {
  label: string;
  id: string;
  value: T | "";
  onChange: (value: T) => void;
  options?: T[];
  groups?: OptionGroup<T>[];
  placeholder?: string;
}

// Generisk select-komponent som stödjer både platta listor och optgroups
export function SelectField<T extends string>({
  label,
  id,
  value,
  onChange,
  options,
  groups,
  placeholder = "Välj...",
}: SelectFieldProps<T>) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {/* Platta alternativ */}
        {options &&
          options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}

        {/* Grupperade alternativ med optgroup */}
        {groups &&
          groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </div>
  );
}