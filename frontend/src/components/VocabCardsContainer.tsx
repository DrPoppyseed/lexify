import { Grid } from "@mui/material";
import { FC } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core/dist/types";
import VocabCard from "./VocabCard/VocabCard";
import AddVocabWordCard from "./VocabCard/AddVocabWordCard";
import { useGetVocabWords, useUpdateVocabWords } from "../hooks/useVocabWord";
import { VocabWord } from "../api/types";

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

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (data && active.id !== over?.id) {
      const vocabWords = [...data];
      const vocabWord = vocabWords.find(({ id }) => id === active.id);

      if (vocabWord) {
        const fromIndex = vocabWords.indexOf(vocabWord);
        const toIndex = vocabWords.findIndex(({ id }) => id === over?.id);
        vocabWords.splice(fromIndex, 1);
        vocabWords.splice(toIndex, 0, vocabWord);
        vocabWords.map<VocabWord>((word, index) => ({
          ...word,
          priority: index,
        }));
        updateVocabWords(vocabWords);
      } else {
        console.log(`vocabWord(id=${active.id}) not found!`);
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
