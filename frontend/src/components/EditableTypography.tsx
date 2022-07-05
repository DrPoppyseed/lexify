import { styled, TextField } from "@mui/material";
import { FC, KeyboardEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type EditableTypographyProps = {
  text: string;
  onSubmit: () => void;
  register: UseFormRegisterReturn;
  placeholder?: string;
  isWord?: boolean;
};

// Inspired by https://stackoverflow.com/a/1037385/11435461
const EditableTypography: FC<EditableTypographyProps> = ({
  text,
  onSubmit,
  register,
  isWord = false,
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
    <EditableTypographyBase
      {...register}
      InputProps={{
        disableUnderline: true,
        inputProps: {
          style: {
            textAlign: "center",
          },
        },
      }}
      onKeyDown={(e) => {
        if (shouldIgnore(e)) return;
        clearPreviousTimeout();
      }}
      onKeyUp={(e) => {
        if (shouldIgnore(e)) return;
        clearPreviousTimeout();
        currentTimeout = setTimeout(() => {
          onSubmit();
        }, 500);
      }}
      onClick={(e) => e.stopPropagation()}
      sx={{ textDecoration: isWord ? "underline" : "inherit" }}
      placeholder={placeholder}
      autoFocus
      multiline
    >
      {text}
    </EditableTypographyBase>
  );
};

const EditableTypographyBase = styled(TextField)`
  text-align: center;
`;

export default EditableTypography;
