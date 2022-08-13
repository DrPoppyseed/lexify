import { styled } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useRecoilState } from "recoil";
import produce from "immer";
import { EditableTitle } from "../EditableTypography/EditableTypography";
import EditableTypographyBase from "../EditableTypography/EditableTypographyBase";
import { collectionState } from "../../state/collectionsState";

const collectionEditorSchema = z.object({
  title: z.string().max(50),
  description: z.string(),
});

export type CollectionEditorForm = z.infer<typeof collectionEditorSchema>;

const CollectionEditor: FC<{ id: string }> = ({ id }) => {
  const [collection, setCollection] = useRecoilState(collectionState(id));
  const { reset, register, handleSubmit } = useForm<CollectionEditorForm>({
    resolver: zodResolver(collectionEditorSchema),
    defaultValues: {
      title: collection.title,
      description: collection.description,
    },
  });

  useEffect(() => {
    reset({
      title: collection.title,
      description: collection.description,
    });
  }, [reset, id]);

  const onSubmit: SubmitHandler<CollectionEditorForm> = (formData) => {
    setCollection((prev) =>
      produce(prev, (draft) => {
        draft.title = formData.title;
        draft.description = formData.description;
      })
    );
  };

  return (
    <CollectionEditorBase>
      <EditableTitle
        onSubmit={() => handleSubmit(onSubmit)()}
        register={register("title")}
        // placeholder={collection.title}
      />
      <EditableTypographyBase
        onSubmit={() => handleSubmit(onSubmit)()}
        register={register("description")}
        // placeholder={collection.description}
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
