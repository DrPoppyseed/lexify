import { AxiosResponse } from "axios";
import type { VocabWord } from "./types";
import { api } from "../config/axios";
import { authHeader } from "./utils";

export const getVocabWords = async (
  collectionId: string
): Promise<ReadonlyArray<VocabWord>> => {
  const { data } = await api.get<
    ReadonlyArray<VocabWord>,
    AxiosResponse<ReadonlyArray<VocabWord>>
  >(`/vocab_words/${collectionId}`, await authHeader());

  return data;
};

export const createVocabWord = async (
  collectionId: string,
  vocabWord: VocabWord
): Promise<ReadonlyArray<VocabWord>> => {
  const { data } = await api.post<
    ReadonlyArray<VocabWord>,
    AxiosResponse<ReadonlyArray<VocabWord>>,
    VocabWord
  >("/vocab_words", vocabWord, await authHeader());

  return data;
};

export const updateVocabWord = async (
  vocabWord: VocabWord
): Promise<Readonly<VocabWord>> => {
  const { data } = await api.put<
    Readonly<VocabWord>,
    AxiosResponse<Readonly<VocabWord>>,
    VocabWord
  >("/vocab_words", vocabWord, await authHeader());

  return data;
};

export const updateVocabWords = async (
  collectionId: string,
  vocabWords: ReadonlyArray<VocabWord>
): Promise<ReadonlyArray<VocabWord>> => {
  const { data } = await api.put<
    ReadonlyArray<VocabWord>,
    AxiosResponse<ReadonlyArray<VocabWord>>,
    ReadonlyArray<VocabWord>
  >(`/vocab_words/${collectionId}`, vocabWords, await authHeader());

  return data;
};
