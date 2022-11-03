import { styled } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { FC, useEffect } from "react";
import { EditableTitle } from "./EditableTypography/EditableTypography";
import EditableTypographyBase from "./EditableTypography/EditableTypographyBase";
import { useUpdateCollection } from "../hooks/useCollection";
import type { Collection } from "../api/types";

const CollectionEditor: FC<Collection> = ({
  id,
  userId,
  name,
  description,
  priority,
}) => {
  const { updateCollection } = useUpdateCollection();
  const { reset, register, handleSubmit } = useForm<{
    name: string;
    description: string;
  }>({
    defaultValues: {
      name,
      description,
    },
  });

  useEffect(() => {
    reset({
      name,
      description,
    });
  }, [reset, name, description]);

  const onSubmit: SubmitHandler<{ name: string; description: string }> = (
    formData
  ) =>
    updateCollection({
      ...formData,
      id,
      userId,
      priority,
    });

  return (
    <CollectionEditorBase>
      <EditableTitle
        onSubmit={() => handleSubmit(onSubmit)()}
        register={register("name")}
      />
      <EditableTypographyBase
        onSubmit={() => handleSubmit(onSubmit)()}
        register={register("description")}
        fullWidth
      />
    </CollectionEditorBase>
  );
};

const CollectionEditorBase = styled("form")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default CollectionEditor;
