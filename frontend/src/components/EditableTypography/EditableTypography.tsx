import { FC } from "react";
import EditableTypographyBase, {
  EditableTypographyBaseProps,
} from "./EditableTypographyBase";

export type EditableTypographyProps = Omit<
  EditableTypographyBaseProps,
  "textAlign" | "textDecoration" | "fontSize" | "enableEnter"
>;

export const EditableTitle: FC<EditableTypographyProps> = ({
  onSubmit,
  register,
  placeholder = "Untitled",
}) => (
  <EditableTypographyBase
    onSubmit={onSubmit}
    register={register}
    placeholder={placeholder}
    fontSize={24}
    enableEnter={false}
    fullWidth
  />
);

export const EditableWord: FC<EditableTypographyProps> = ({
  onSubmit,
  register,
  placeholder = "Vocabulary Word",
}) => (
  <EditableTypographyBase
    onSubmit={onSubmit}
    register={register}
    placeholder={placeholder}
    textDecoration="underline"
    textAlign="center"
  />
);

export const EditableDefinition: FC<EditableTypographyProps> = ({
  onSubmit,
  register,
  placeholder = "Definition",
}) => (
  <EditableTypographyBase
    onSubmit={onSubmit}
    register={register}
    placeholder={placeholder}
    textAlign="center"
    rows={3}
    multiline
    fullWidth
    enableEnter
  />
);
