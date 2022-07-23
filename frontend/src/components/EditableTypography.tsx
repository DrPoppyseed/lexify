import { TextField } from "@mui/material";
import { FC, KeyboardEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type EditableTypographyVariant =
  | "word"
  | "definition"
  | "title"
  | "description";

type EditableTypographyProps = {
  onSubmit: () => void;
  register: UseFormRegisterReturn;
  placeholder?: string;
  variant?: EditableTypographyVariant;
};

// Inspired by https://stackoverflow.com/a/1037385/11435461
const EditableTypography: FC<EditableTypographyProps> = ({
  onSubmit,
  register,
  variant = "definition",
  placeholder,
}) => {
  let currentTimeout = 0;

  const clearPreviousTimeout = () => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
  };

  const shouldIgnore = (event: KeyboardEvent<HTMLDivElement>) => {
    const keysToIgnore = [
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Meta",
      "Alt",
      "Control",
      "Escape",
    ];
    return keysToIgnore.includes(event.key);
  };

  return (
    <TextField
      {...register}
      InputProps={{
        disableUnderline: true,
        inputProps: {
          style: {
            textAlign:
              variant !== "title" && variant !== "description"
                ? "center"
                : "inherit",
            fontSize: variant === "title" ? 24 : 16,
          },
        },
      }}
      onKeyDown={(e) => {
        if (shouldIgnore(e)) return;
        clearPreviousTimeout();

        if (variant === "title" && e.key === "Enter") {
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
      sx={{ textDecoration: variant === "word" ? "underline" : "inherit" }}
      placeholder={placeholder}
      autoFocus
      multiline
    />
  );
};

// const EditableTypographyBase = styled(TextField)`
//  text-align: center;
// `;

export default EditableTypography;
