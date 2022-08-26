import React, { ChangeEvent, FocusEvent, KeyboardEvent, useState } from "react";

import styles from "./inline.module.css";

interface IProps {
  value: string;
  setValue: any;
}

const InlineEdit = ({ value, setValue }: IProps) => {
  const [editingValue, setEditingValue] = useState(value);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditingValue(e.target.value);

  const onKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.target.blur();
    }
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.value.trim() === "") {
      setEditingValue(value);
    } else {
      setValue(e.target.value);
    }
  };

  return (
    <select
      className={styles.inline}
      aria-label="Field name"
      value={editingValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <option value={editingValue}>{editingValue}</option>
      <option value="In-Progress">In-Progress</option>
      <option value="Complete">Complete</option>
    </select>
  );
};

export default InlineEdit;
