import React from "react";
import styles from "../styles/Formfield.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function FormField({
  label,
  value,
  onChangeText,
  error,
  required,
  helpText,
  icon,
  type = "text",
  maxLength,
  onIconPress,
  rightIcon, // Ensure this is not passed down to <input>
  ...props
}) {
  const [focused, setFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  const handleChange = (e) => {
    onChangeText(e.target.value);
  };

  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelContainer}>
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
          {maxLength && (
            <span className={styles.characterCount}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}

      <div className={styles.inputContainer}>
        {icon && (
          <button
            className={styles.icon}
            onClick={onIconPress}
            disabled={!onIconPress}
            type="button"
          >
            {icon}
          </button>
        )}

        <input
          className={[
            styles.input,
            icon && styles.inputWithIcon,
            error && styles.inputError,
            focused && styles.inputFocused,
            props.multiline && styles.multilineInput,
          ].join(" ")}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type={isPassword && !showPassword ? "password" : type}
          {...props} // rightIcon is removed from props
        />

        {rightIcon && (
          <button className={styles.rightIcon} type="button">
            {rightIcon}
          </button>
        )}

        {isPassword && (
          <button
            className={styles.passwordIcon}
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {helpText && <p className={styles.helpText}>{helpText}</p>}
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
