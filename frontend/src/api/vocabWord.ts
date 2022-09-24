import { AxiosResponse } from "axios";
import type { VocabWord } from "./types";
import { api } from "../config/axios";
import { authHeader } from "./utils";

export const createVocabWord = async (vocabWord: VocabWord): Promise<null> => {
  const { data } = await api.post<null, AxiosResponse<null>, VocabWord>(
    "/vocab_words",
    vocabWord,
    await authHeader()
  );

  return data;
};

export const updateVocabWord = async (vocabWord: VocabWord): Promise<null> => {
  const { data } = await api.put<null, AxiosResponse<null>, VocabWord>(
    "/vocab_words",
    vocabWord,
    await authHeader()
  );

  return data;
};
