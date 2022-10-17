import { getAuth } from "firebase/auth";
import { VocabWord } from "./api/types";

// TODO: come up with a functional way of handling this
export const moveVocabWord = (
  vocabWords: Array<VocabWord>,
  vocabWord: VocabWord,
  activeId: string,
  overId: string
) => {
  const fromIndex = vocabWords.findIndex(({ id }) => id === activeId);
  const toIndex = vocabWords.findIndex(({ id }) => id === overId);
  vocabWords.splice(fromIndex, 1);
  vocabWords.splice(toIndex, 0, vocabWord);
  return vocabWords.map((word, index) => ({
    ...word,
    priority: index + 1,
  }));
};

export const authHeader = async () => {
  const token = await getAuth()?.currentUser?.getIdToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
