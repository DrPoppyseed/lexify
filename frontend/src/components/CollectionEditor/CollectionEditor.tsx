import { styled } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EditableTypography from "../EditableTypography";

const collectionEditorSchema = z.object({
  title: z.string().max(50),
  description: z.string(),
});

export type CollectionEditorForm = z.infer<typeof collectionEditorSchema>;

const CollectionEditor = () => {
  const { register, handleSubmit } = useForm<CollectionEditorForm>({
    resolver: zodResolver(collectionEditorSchema),
  });

  const onSubmit: SubmitHandler<CollectionEditorForm> = (formData) => {
    console.log(formData);
  };

  return (
    <CollectionEditorBase>
      <EditableTypography
        onSubmit={() => handleSubmit(onSubmit)()}
        register={register("title")}
        placeholder="Title"
        variant="title"
      />
      <EditableTypography
        onSubmit={() => handleSubmit(onSubmit)()}
        register={register("description")}
        placeholder="Description"
        variant="description"
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
