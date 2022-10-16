import { VocabWord } from "./api/types";

// TODO: come up with a functional way of handling this
export const moveVocabWord = (
  vocabWords: Array<VocabWord>,
  vocabWord: VocabWord,
  destinationId: string
) => {
  const fromIndex = vocabWords.indexOf(vocabWord);
  const toIndex = vocabWords.findIndex(({ id }) => id === destinationId);
  vocabWords.splice(fromIndex, 1);
  vocabWords.splice(toIndex, 0, vocabWord);
  return vocabWords.map((word, index) => ({
    ...word,
    priority: index + 1,
  }));
};
