import { Grid } from "@mui/material";
import { FC } from "react";
import {
  Active,
  closestCenter,
  DndContext,
  Over,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import VocabCard from "./VocabCard/VocabCard";
import AddVocabWordCard from "./VocabCard/AddVocabWordCard";
import { useGetVocabWords, useUpdateVocabWords } from "../hooks/useVocabWord";
import { moveVocabWord } from "../utils";

const activationConstraint = {
  delay: 250,
  tolerance: 5,
};

const VocabCardsContainer: FC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const { data } = useGetVocabWords(collectionId);
  const { updateVocabWords } = useUpdateVocabWords(collectionId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint }),
    useSensor(TouchSensor, { activationConstraint })
  );

  const handleDragEnd = ({
    active,
    over,
  }: {
    active: Active;
    over: Over | null;
  }) => {
    if (data && active.id !== over?.id) {
      const vocabWord = data.find(({ id }) => id === active.id);
      if (vocabWord && over?.id) {
        updateVocabWords(
          moveVocabWord([...data], vocabWord, over.id.toString())
        );
      }
    }
  };

  return (
    <Grid container>
      <Grid item xs={1} />
      <Grid item xs={10} container spacing={2}>
        {data ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={rectSortingStrategy}
              items={data.map((word) => word.id)}
            >
              {data?.map((vocabWord) => (
                <VocabCard
                  key={vocabWord.id}
                  vocabWord={vocabWord}
                  collectionId={collectionId}
                />
              ))}
            </SortableContext>
            <AddVocabWordCard collectionId={collectionId} />
          </DndContext>
        ) : (
          <div>Loading words...</div>
        )}
      </Grid>
      <Grid item xs={1} />
    </Grid>
  );
};

export default VocabCardsContainer;
