import { FC, MouseEvent, ReactNode, useState } from "react";
import { Card as MuiCard, styled } from "@mui/material";
import { useRecoilState } from "recoil";
import { Clear } from "@mui/icons-material";
import FlipCard from "./FlipCard";
import { Sides } from "../types/Sides";
import { isShakingState } from "../state/isShaking";
import { useRemoveVocabWord } from "../state/vocabWords";

type Props = {
  front: ReactNode;
  back: ReactNode;
  id: string;
};

const VocabWordCardBase: FC<Props> = ({ front, back, id }) => {
  const [side, setSide] = useState<Sides>("front");
  const [isShaking, setIsShaking] = useRecoilState(isShakingState);
  const removeVocabWord = useRemoveVocabWord();

  let currentTimeout = 0;

  const clearPreviousTimeout = () => {
    if (currentTimeout) clearTimeout(currentTimeout);
  };

  const onRemoveVocabCardClicked = (e?: MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    removeVocabWord(id);
  };

  return (
    <CardContainer isShaking={isShaking}>
      <Card
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          if (!isShaking) clearPreviousTimeout();
          setSide(side === "front" ? "back" : "front");
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          currentTimeout = setTimeout(() => {
            setIsShaking(true);
          }, 2000);
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          if (!isShaking) clearPreviousTimeout();
        }}
      >
        <FlipCard side={side} front={front} back={back} />
      </Card>
      {isShaking && (
        <RemoveCardButton onClick={onRemoveVocabCardClicked}>
          <Clear fontSize="small" color="disabled" />
        </RemoveCardButton>
      )}
    </CardContainer>
  );
};

const CardContainer = styled("div", {
  shouldForwardProp: (props) => props !== "isShaking",
})<{ isShaking: boolean }>`
  position: relative;
  animation: ${({ isShaking }) =>
    `shake 0.8s infinite linear ${isShaking ? "running" : "initial"}`};
  transform-origin: 50% 100%;

  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -1px) rotate(-1deg);
    }
    20% {
      transform: translate(-1px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(0px, 1px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 1px) rotate(-1deg);
    }
    60% {
      transform: translate(-1px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(1px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -1px) rotate(-1deg);
    }
  }
`;

const Card = styled(MuiCard)`
  position: relative;
  height: ${({ theme }) => theme.spacing(16)};
`;

const RemoveCardButton = styled("div")`
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.palette.action.disabled};
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.background.paper};
  z-index: 99;
  cursor: pointer;
`;

export default VocabWordCardBase;
