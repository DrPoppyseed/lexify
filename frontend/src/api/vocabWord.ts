import type { AxiosResponse } from "axios";
import type { VocabWord } from "./types";
import { api } from "../config/axios";
import { authHeader } from "../utils";

export const getVocabWords = async (
  collectionId: string
): Promise<ReadonlyArray<VocabWord>> =>
  api
    .get<ReadonlyArray<VocabWord>, AxiosResponse<ReadonlyArray<VocabWord>>>(
      `/vocab_words/${collectionId}`,
      await authHeader()
    )
    .then((res) => res.data);

export const createVocabWord = async (
  collectionId: string,
  vocabWord: VocabWord
): Promise<ReadonlyArray<VocabWord>> =>
  api
    .post<
      ReadonlyArray<VocabWord>,
      AxiosResponse<ReadonlyArray<VocabWord>>,
      VocabWord
    >("/vocab_words", vocabWord, await authHeader())
    .then((res) => res.data);

export const updateVocabWord = async (
  vocabWord: VocabWord
): Promise<Readonly<VocabWord>> =>
  api
    .put<Readonly<VocabWord>, AxiosResponse<Readonly<VocabWord>>, VocabWord>(
      "/vocab_words",
      vocabWord,
      await authHeader()
    )
    .then((res) => res.data);

export const updateVocabWords = async (
  collectionId: string,
  vocabWords: ReadonlyArray<VocabWord>
): Promise<ReadonlyArray<VocabWord>> =>
  api
    .put<
      ReadonlyArray<VocabWord>,
      AxiosResponse<ReadonlyArray<VocabWord>>,
      ReadonlyArray<VocabWord>
    >(`/vocab_words/${collectionId}`, vocabWords, await authHeader())
    .then((res) => res.data);
