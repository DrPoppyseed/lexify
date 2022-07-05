import { atom, atomFamily, useRecoilCallback } from "recoil";
import { nanoid } from "nanoid";
import type { VocabWord } from "../types/VocabWord";
import type { VocabWordForm } from "../components/VocabWordCard";

export const vocabWordsState = atom<ReadonlyArray<string>>({
  key: "vocabWords",
  default: [],
});

export const vocabWordState = atomFamily<VocabWord, string>({
  key: "vocabWord",
  default: {
    word: "",
    definition: "",
    id: nanoid(),
    fails: 0,
    successes: 0,
  },
});

export const useCreateVocabWord = () =>
  useRecoilCallback(
    ({ set }) =>
      (vocabWord: VocabWordForm) => {
        const id = nanoid();
        set(vocabWordsState, (currVal) => [...currVal, id]);
        set(vocabWordState(id), {
          ...vocabWord,
          id: nanoid(),
          fails: 0,
          successes: 0,
        });
      },
    []
  );

export const useRemoveVocabWord = () =>
  useRecoilCallback(({ set, reset }) => (id: string) => {
    reset(vocabWordState(id));
    set(vocabWordsState, (prev) => prev.filter((p) => p !== id));
  });
