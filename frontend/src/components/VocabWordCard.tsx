import React, { FC, MouseEvent } from "react";
import { ButtonBase, styled } from "@mui/material";
import { Check, QuestionMark } from "@mui/icons-material";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRecoilState } from "recoil";
import produce from "immer";
import VocabWordCardBase from "./VocabWordCardBase";
import type { VocabWord } from "../types/VocabWord";
import { vocabWordState } from "../state/vocabWords";
import RippleCircle from "./RippleCircle";
import EditableTypography from "./EditableTypography";

type VocabWordCardProps = {
  id: string;
};

const vocabWordSchema = z.object({
  word: z.string().min(1).max(255),
  definition: z.string().max(255),
});

export type VocabWordForm = z.infer<typeof vocabWordSchema>;

const VocabWordCard: FC<VocabWordCardProps> = ({ id }) => {
  const [vocabWord, setVocabWord] = useRecoilState(vocabWordState(id));

  const { register, handleSubmit } = useForm<VocabWord>({
    resolver: zodResolver(vocabWordSchema),
    defaultValues: {
      ...vocabWord,
    },
  });

  const onSubmit: SubmitHandler<VocabWord> = (formData) => {
    setVocabWord((prevVocabWord) =>
      produce(prevVocabWord, (draft) => {
        draft.word = formData.word;
        draft.definition = formData.definition;
      })
    );
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
    <VocabWordCardBase
      id={id}
      front={
        <Front>
          <NotKnowsWordButton onClick={onVocabWordNotKnownClicked}>
            <QuestionMark color="error" />
          </NotKnowsWordButton>
          <EditableTypography
            text={vocabWord.word}
            onSubmit={() => handleSubmit(onSubmit)()}
            register={register("word")}
            placeholder="Vocabulary word"
            isWord
          />
          <KnowsWordActionArea onClick={onVocabWordKnownClicked}>
            <Check color="success" />
          </KnowsWordActionArea>
          <Indicator>
            <RippleCircle />
          </Indicator>
        </Front>
      }
      back={
        <Back>
          <EditableTypography
            register={register("definition")}
            onSubmit={() => handleSubmit(onSubmit)()}
            text={vocabWord.definition}
            placeholder="Definition"
          />
        </Back>
      }
    />
  );
};

const Back = styled("form")`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Front = styled("form")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Indicator = styled("div")`
  position: absolute;
  left: 50%;
  transform: translateX(-${({ theme }) => theme.spacing(1)});
  bottom: ${({ theme }) => theme.spacing(4)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  opacity: 0;
  transition: opacity 0.6s;

  &:hover {
    opacity: 1;
  }
`;

const NotKnowsWordButton = styled(ButtonBase)`
  position: absolute;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;

  height: 100%;
  width: ${(props) => props.theme.spacing(12)};
  background: linear-gradient(to left, transparent, rgba(255, 182, 185, 0.6));

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const KnowsWordActionArea = styled(ButtonBase)`
  position: absolute;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;

  height: 100%;
  width: ${(props) => props.theme.spacing(12)};
  background: linear-gradient(to right, transparent, rgba(97, 192, 191, 0.6));

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

export default VocabWordCard;
