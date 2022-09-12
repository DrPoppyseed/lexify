import { FC, MouseEvent, useState } from "react";
import { ButtonBase, css, styled, Typography } from "@mui/material";
import { Check, QuestionMark } from "@mui/icons-material";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRecoilState } from "recoil";
import produce from "immer";
import VocabCardFlipperBase from "./VocabCardFlipperBase";
import type { VocabWord } from "../../domain/types";
import { vocabWordState } from "../../state/vocabWordsState";
import VocabCardOneSideBase from "./VocabCardOneSideBase";
import { Sides } from "../../types/Sides";
import {
  EditableDefinition,
  EditableWord,
} from "../EditableTypography/EditableTypography";

type VocabWordCardProps = {
  id: string;
};

const vocabWordSchema = z.object({
  word: z.string().min(1).max(255),
  definition: z.string().max(255),
});

export type VocabWordForm = z.infer<typeof vocabWordSchema>;

const VocabCard: FC<VocabWordCardProps> = ({ id }) => {
  const [vocabWord, setVocabWord] = useRecoilState(vocabWordState(id));
  const [side, setSide] = useState<Sides>("front");

  // const asyncUpdateVocabCard = useMutation((vocabWord: VocabWord) => {
  //   const TEMP_collectionId = "temp_collection_id";
  //   return api.post(`/collections/${TEMP_collectionId}/words/${id}`, vocabWord);
  // });

  const { register, handleSubmit } = useForm<VocabWord>({
    resolver: zodResolver(vocabWordSchema),
    defaultValues: {
      ...vocabWord,
    },
  });

  const onSubmit: SubmitHandler<VocabWord> = (formData) => {
    const updatedVocabCard = produce(vocabWord, (draft) => {
      draft.word = formData.word;
      draft.definition = formData.definition;
    });

    setVocabWord(updatedVocabCard);
    console.log("updated: ", updatedVocabCard);
  };

  const onVocabWordNotKnownClicked = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setVocabWord((prevVocabWord) =>
      produce(prevVocabWord, (draft) => {
        draft.fails++;
      })
    );
  };

  const onVocabWordKnownClicked = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setVocabWord((prevVocabWord) =>
      produce(prevVocabWord, (draft) => {
        draft.successes++;
      })
    );
  };

  return (
    <VocabCardFlipperBase
      side={side}
      id={id}
      front={
        <VocabCardOneSideBase setSide={setSide}>
          <NotKnowsWordButton onClick={onVocabWordNotKnownClicked}>
            <QuestionMark color="error" />
          </NotKnowsWordButton>
          <EditableWord
            onSubmit={() => handleSubmit(onSubmit)()}
            register={register("word")}
          />
          <Tally>
            <Typography variant="caption">{vocabWord.fails}</Typography>
            &nbsp;-&nbsp;
            <Typography variant="caption">{vocabWord.successes}</Typography>
          </Tally>
          <KnowsWordButton onClick={onVocabWordKnownClicked}>
            <Check color="success" />
          </KnowsWordButton>
        </VocabCardOneSideBase>
      }
      back={
        <VocabCardOneSideBase setSide={setSide}>
          <EditableDefinition
            register={register("definition")}
            onSubmit={() => handleSubmit(onSubmit)()}
          />
        </VocabCardOneSideBase>
      }
    />
  );
};

const Tally = styled("div")`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(4)};
  opacity: 0.5;
`;

const WordActionArea = css`
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const NotKnowsWordButton = styled(ButtonBase)`
  ${WordActionArea};
  left: 0;
  width: ${(props) => props.theme.spacing(12)};
  background: linear-gradient(to left, transparent, rgba(255, 182, 185, 0.6));
`;

const KnowsWordButton = styled(ButtonBase)`
  ${WordActionArea};
  right: 0;
  width: ${(props) => props.theme.spacing(12)};
  background: linear-gradient(to right, transparent, rgba(97, 192, 191, 0.6));
`;

export default VocabCard;
