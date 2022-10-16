import { styled } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { EditableTitle } from "./EditableTypography/EditableTypography";
import EditableTypographyBase from "./EditableTypography/EditableTypographyBase";
import { useUpdateCollection } from "../hooks/useCollection";
import { Collection } from "../api/types";
import { Option } from "../types/utils";

const collectionEditorSchema = z.object({
  name: z.string().max(50),
  description: z.string(),
});

export type CollectionEditorForm = z.infer<typeof collectionEditorSchema>;

const CollectionEditor: FC<{
  id: string;
  userId: string;
  name: string;
  description: Option<string>;
}> = ({ id, userId, name, description }) => {
  const { updateCollection } = useUpdateCollection();
  const { reset, register, handleSubmit } = useForm<CollectionEditorForm>({
    resolver: zodResolver(collectionEditorSchema),
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

  const onSubmit: SubmitHandler<CollectionEditorForm> = (formData) => {
    const updatedCollection: Collection = {
      id,
      userId,
      ...formData,
    };
    updateCollection(updatedCollection);
  };

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
