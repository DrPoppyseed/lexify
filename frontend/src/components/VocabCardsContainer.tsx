import { Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  Active,
  closestCenter,
  DndContext,
  Over,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import VocabCard from "./VocabCard/VocabCard";
import AddVocabWordCard from "./VocabCard/AddVocabWordCard";
import { useGetVocabWords, useUpdateVocabWords } from "../hooks/useVocabWord";
import { moveVocabWord } from "../utils";
import { VocabWord } from "../api/types";

const activationConstraint = {
  delay: 150,
  tolerance: 5,
};

const VocabCardsContainer: FC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const { data } = useGetVocabWords(collectionId);
  const { updateVocabWords } = useUpdateVocabWords(collectionId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint })
  );

  // INFO: We need a synchronous "cache" layer for the vocabWords to deal with a rendering issue where dnd-kit
  //   animates the cards immediately after dragEnd is triggered, making for jittery animation when using with
  //   an asynchronous store like react-query. See https://github.com/clauderic/dnd-kit/issues/833 for more
  const [cards, setCards] = useState<ReadonlyArray<VocabWord> | null>(null);

  useEffect(() => {
    if (data) {
      setCards(data);
    }
  }, [data]);

  const handleDragEnd = ({
    active,
    over,
  }: {
    active: Active;
    over: Over | null;
  }) => {
    if (!active) {
      return;
    }

    if (data && active.id !== over?.id) {
      const vocabWord = data.find(({ id }) => id === active.id);
      if (vocabWord && over?.id) {
        const updatedVocabWords = moveVocabWord(
          [...data],
          vocabWord,
          active.id.toString(),
          over.id.toString()
        );
        setCards(updatedVocabWords);
        updateVocabWords(updatedVocabWords);
      }
    }
  };

  return (
    <Grid container>
      <Grid item xs={1} />
      <Grid item xs={10} container spacing={2}>
        {cards ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={rectSortingStrategy}
              items={cards.map((word) => word.id)}
            >
              {cards.map((vocabWord) => (
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
