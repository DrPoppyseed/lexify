import { FC, MouseEvent, useState } from "react";
import { ButtonBase, css, styled, Typography } from "@mui/material";
import { Check, QuestionMark } from "@mui/icons-material";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import produce from "immer";
import VocabCardBase from "./VocabCardBase";
import {
  EditableDefinition,
  EditableWord,
} from "../EditableTypography/EditableTypography";
import { useUpdateVocabWord } from "../../hooks/useVocabWord";
import { VocabWord } from "../../api/types";
import { Sides } from "../../types/Sides";

const vocabWordSchema = z.object({
  word: z.string().min(1).max(255),
  definition: z.string().max(255),
});

const VocabCard: FC<{
  vocabWord: VocabWord;
  collectionId: string;
}> = ({ vocabWord, collectionId }) => {
  const [side, setSide] = useState<Sides>("front");
  const [tally, setTally] = useState<Pick<VocabWord, "fails" | "successes">>({
    ...vocabWord,
  });
  const { updateVocabWord } = useUpdateVocabWord(collectionId);

  const { register, handleSubmit } = useForm<VocabWord>({
    resolver: zodResolver(vocabWordSchema),
    defaultValues: {
      ...vocabWord,
    },
  });

  const onSubmit: SubmitHandler<VocabWord> = async (formData) => {
    const updatedVocabWord = produce(vocabWord, (draft) => {
      draft.word = formData.word;
      draft.definition = formData.definition;
    });
    await updateVocabWord(updatedVocabWord);
  };

  const onVocabWordNotKnownClicked = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setTally((prev) => ({ ...prev, fails: prev.fails + 1 }));
    updateVocabWord({
      ...vocabWord,
      fails: vocabWord.fails + 1,
    });
  };

  const onVocabWordKnownClicked = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setTally((prev) => ({ ...prev, successes: prev.successes + 1 }));
    updateVocabWord({
      ...vocabWord,
      successes: vocabWord.successes + 1,
    });
  };

  return (
    <VocabCardBase
      id={vocabWord.id}
      side={side}
      setSide={setSide}
      front={
        <>
          <NotKnowsWordButton onClick={(e) => onVocabWordNotKnownClicked(e)}>
            <QuestionMark color="error" />
          </NotKnowsWordButton>
          <EditableWord
            onSubmit={() => handleSubmit(onSubmit)()}
            register={register("word")}
          />
          <Tally>
            <Typography variant="caption">{tally.fails}</Typography>
            &nbsp;-&nbsp;
            <Typography variant="caption">{tally.successes}</Typography>
          </Tally>
          <KnowsWordButton onClick={(e) => onVocabWordKnownClicked(e)}>
            <Check color="success" />
          </KnowsWordButton>
        </>
      }
      back={
        <EditableDefinition
          register={register("definition")}
          onSubmit={() => handleSubmit(onSubmit)()}
        />
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
  align-items: center;
  justify-content: center;
  height: 100%;

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
