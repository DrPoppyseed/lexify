import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VocabWord } from "../api/types";
import {
  createVocabWord as createVocabWordInAPI,
  getVocabWords,
  updateVocabWord as updateVocabWordInAPI,
} from "../api/vocabWord";
import { vocabWordFactory } from "../domain/vocabWord";
import { Option } from "../types/utils";

export const useCreateVocabWord = (collectionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (vocabWord: VocabWord) => createVocabWordInAPI(collectionId, vocabWord),
    {
      onMutate: async (vocabWord: VocabWord) => {
        await queryClient.cancelQueries(["getVocabWords", collectionId]);
        const prevCollection = queryClient.getQueryData<
          ReadonlyArray<VocabWord>
        >(["vocabWords", collectionId]);
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          (prev) => [...(prev || []), vocabWord]
        );

        return { prevCollection };
      },
      onError: (err, vocabWord, context) => {
        queryClient.setQueryData<ReadonlyArray<VocabWord>>(
          ["vocabWords", collectionId],
          context?.prevCollection
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["vocabWords", collectionId]);
      },
    }
  );

  const createVocabWord = () =>
    mutate({
      ...vocabWordFactory(collectionId),
      collectionId,
    });

  return { createVocabWord, isLoading, isError, isSuccess };
};

export const useUpdateVocabWord = (collectionId: string) => {
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (vocabWord: VocabWord) => updateVocabWordInAPI(vocabWord)
  );

  const updateVocabWord = async (vocabWord: VocabWord) => {
    mutate({
      ...vocabWord,
      collectionId,
    });
  };

  return { updateVocabWord, isLoading, isError, isSuccess };
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
