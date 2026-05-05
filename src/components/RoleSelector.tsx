import { useEffect } from "react";
import type { Role } from "../data/options";
import { roleGroups } from "../data/options";
import styles from "./RoleSelector.module.css";

interface RoleSelectorProps {
  value: Role | "";
  customRole: string;
  onRoleChange: (role: Role | "") => void;
  onCustomRoleChange: (custom: string) => void;
}

export function RoleSelector({
  value,
  customRole,
  onRoleChange,
  onCustomRoleChange,
}: RoleSelectorProps) {

  // När användaren väljer en roll prefylls fritextfältet
  useEffect(() => {
    if (value) {
      onCustomRoleChange(value);
    }
  }, [value]);

  return (
    <div className={styles.container}>
      <label htmlFor="role" className={styles.label}>
        Roll
      </label>
      <select
        id="role"
        className={styles.select}
        value={value}
        onChange={(e) => onRoleChange(e.target.value as Role | "")}
      >
        <option value="" disabled>
          Välj din roll...
        </option>
        {roleGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Textfältet visas alltid – prefylls med vald roll men kan ändras fritt */}
      <div className={styles.customContainer}>
        <label htmlFor="customRole" className={styles.customLabel}>
          Specificera eller ändra din roll (används i prompten)
        </label>
        <input
          id="customRole"
          type="text"
          className={styles.customInput}
          value={customRole}
          onChange={(e) => onCustomRoleChange(e.target.value)}
          placeholder="T.ex. Senior Business Analyst med fokus på kravhantering"
        />
      </div>
    </div>
  );
}