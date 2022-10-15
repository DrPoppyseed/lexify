import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VocabWord } from "../api/types";
import {
  createVocabWord as createVocabWordInAPI,
  getVocabWords,
  updateVocabWord as updateVocabWordInAPI,
  updateVocabWords as updateVocabWordsInAPI,
} from "../api/vocabWord";
import { vocabWordFactory } from "../domain/vocabWord";
import { Option } from "../types/utils";

export const useCreateVocabWord = (collectionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (vocabWord: VocabWord) => createVocabWordInAPI(collectionId, vocabWord),
    {
      onMutate: async (vocabWord: VocabWord) => {
        await queryClient.cancelQueries(["vocabWords", collectionId]);
        const prevVocabWords = queryClient.getQueryData<
          ReadonlyArray<VocabWord>
        >(["vocabWords", collectionId]);
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          (prev) => [...(prev || []), vocabWord]
        );

        return { prevVocabWords };
      },
      onError: (err, vocabWord, context) => {
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          context?.prevVocabWords
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["vocabWords", collectionId]);
      },
    }
  );

  const createVocabWord = () => {
    const cachedVocabWords =
      queryClient.getQueryData<ReadonlyArray<VocabWord>>([
        "vocabWords",
        collectionId,
      ]) || [];

    mutate({
      ...vocabWordFactory(collectionId, cachedVocabWords?.length),
      collectionId,
    });
  };

  return { createVocabWord, isLoading, isError, isSuccess };
};

// idempotent update on a single vocabWord
export const useUpdateVocabWord = (collectionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (vocabWord: VocabWord) => updateVocabWordInAPI(vocabWord),
    {
      onMutate: async (vocabWord: VocabWord) => {
        await queryClient.cancelQueries(["vocabWords", collectionId]);
        const prevVocabWords = queryClient.getQueryData<
          ReadonlyArray<VocabWord>
        >(["vocabWords", collectionId]);
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          (prev) =>
            prev?.map((word) => (word.id === vocabWord.id ? vocabWord : word))
        );

        return { prevVocabWords };
      },
      onError: (err, vocabWord, context) => {
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          context?.prevVocabWords
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["vocabWords", collectionId]);
      },
    }
  );

  const updateVocabWord = (vocabWord: VocabWord) =>
    mutate({
      ...vocabWord,
      collectionId,
    });

  return { updateVocabWord, isLoading, isError, isSuccess };
};

// idempotent update on vocabWords array
export const useUpdateVocabWords = (collectionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (vocabWords: ReadonlyArray<VocabWord>) =>
      updateVocabWordsInAPI(collectionId, vocabWords),
    {
      onMutate: async (vocabWords: ReadonlyArray<VocabWord>) => {
        await queryClient.cancelQueries(["vocabWords", collectionId]);
        const prevVocabWords = queryClient.getQueryData<
          ReadonlyArray<VocabWord>
        >(["vocabWords", collectionId]);
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          vocabWords
        );

        return { prevVocabWords };
      },
      onError: (err, vocabWords, context) => {
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          context?.prevVocabWords
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["vocabWords", collectionId]);
      },
    }
  );

  const updateVocabWords = (vocabWords: ReadonlyArray<VocabWord>) => {
    mutate(vocabWords);
  };

  return { updateVocabWords, isLoading, isError, isSuccess };
};

export const useGetVocabWords = (collectionId: Option<string>) => {
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["vocabWords", collectionId],
    () => getVocabWords(collectionId as string),
    {
      enabled: !!collectionId,
    }
  );

  return { data, isLoading, isError, isSuccess };
};
