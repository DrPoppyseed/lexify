import { useMutation } from "@tanstack/react-query";
import type { VocabWord } from "../api/types";
import {
  createVocabWord as createVocabWordInAPI,
  updateVocabWord as updateVocabWordInAPI,
} from "../api/vocabWord";
import { vocabWordFactory } from "../domain/vocabWord";

export const useCreateVocabWord = () => {
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (vocabWord: VocabWord) => createVocabWordInAPI(vocabWord)
  );

  const createVocabWord = (collectionId: string) => {
    const vocabWord = vocabWordFactory(collectionId);
    mutate({
      ...vocabWord,
      collectionId,
    });
  };

  return { createVocabWord, isLoading, isError, isSuccess };
};

export const useUpdateVocabWord = () => {
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (vocabWord: VocabWord) => updateVocabWordInAPI(vocabWord)
  );

  const updateVocabWord = async (
    collectionId: string,
    vocabWord: VocabWord
  ) => {
    mutate({
      ...vocabWord,
      collectionId,
    });
  };

  return { updateVocabWord, isLoading, isError, isSuccess };
};
