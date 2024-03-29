import { TextField } from "@mui/material";
import { FC, KeyboardEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type TextAlign =
  | "center"
  | "end"
  | "justify"
  | "left"
  | "match-parent"
  | "right"
  | "start";

type TextDecoration = "underline" | "inherit";

export type EditableTypographyBaseProps = {
  onSubmit: () => void;
  register: UseFormRegisterReturn;
  placeholder?: string;
  textAlign?: TextAlign;
  fontSize?: number;
  textDecoration?: TextDecoration;
  enableEnter?: boolean;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
};

// Inspired by https://stackoverflow.com/a/1037385/11435461
const EditableTypographyBase: FC<EditableTypographyBaseProps> = ({
  onSubmit,
  register,
  textAlign = "inherit" as const,
  placeholder,
  fontSize = 16,
  textDecoration = "inherit",
  enableEnter = true,
  multiline = false,
  rows = 3,
  fullWidth = false,
}) => {
  let currentTimeout = 0;

  const clearPreviousTimeout = () => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
  };

  const shouldIgnore = (event: KeyboardEvent<HTMLDivElement>) =>
    [
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Meta",
      "Alt",
      "Control",
      "Escape",
    ].includes(event.key);

  return (
    <TextField
      {...register}
      InputProps={{
        disableUnderline: true,
        inputProps: {
          style: {
            textAlign,
            fontSize,
          },
        },
      }}
      onKeyDown={(e) => {
        if (shouldIgnore(e)) return;
        clearPreviousTimeout();

        if (enableEnter && e.key === "Enter") {
          e.preventDefault();
        }
      }}
      onKeyUp={(e) => {
        if (shouldIgnore(e)) return;
        clearPreviousTimeout();
        currentTimeout = setTimeout(() => {
          onSubmit();
        }, 500);
      }}
      onClick={(e) => e.stopPropagation()}
      sx={{ textDecoration }}
      placeholder={placeholder}
      autoFocus
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
    />
  );
};

export default EditableTypographyBase;
