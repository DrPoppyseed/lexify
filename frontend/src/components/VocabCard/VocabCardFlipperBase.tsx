import { FC, MouseEvent, ReactNode } from "react";
import { css, styled } from "@mui/material";
import { useRecoilValue } from "recoil";
import { Clear } from "@mui/icons-material";
import { Sides } from "../../types/Sides";
import { isShakingState } from "../../state/vocabCardState";
import { useRemoveVocabWord } from "../../state/vocabWordsState";

type VocabCardFlipperBaseProps = {
  front: ReactNode;
  back: ReactNode;
  id: string;
  side: Sides;
};

type FlipDirection = "hor" | "ver";

const VocabCardFlipperBase: FC<VocabCardFlipperBaseProps> = ({
  front,
  back,
  id,
  side,
}) => {
  const isShaking = useRecoilValue(isShakingState);
  const removeVocabWord = useRemoveVocabWord();

  const alpha = 0.3;
  const direction = "hor";

  const onRemoveVocabCardClicked = (e?: MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    removeVocabWord(id);
  };

  return (
    <CardContainer isShaking={isShaking}>
      <FlipCardContainer zIndex="auto">
        <Flipper>
          <Front alpha={alpha} side={side} direction={direction}>
            {front}
          </Front>
          <Back alpha={alpha} side={side} direction={direction}>
            {back}
          </Back>
        </Flipper>
      </FlipCardContainer>

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

const FlipCardContainer = styled("div", {
  shouldForwardProp: (props) => props !== "zIndex",
})<{ zIndex: string }>`
  perspective: 1000px;
  z-index: ${(props) => props.zIndex};
  height: 100%;
  cursor: pointer;
`;

const Flipper = styled("div")`
  height: 100%;
  position: relative;
  width: 100%;
`;

const SideBase = css`
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  backface-visibility: hidden;
`;

const Front = styled("div")<{
  side: Sides;
  direction: FlipDirection;
  alpha: number;
}>`
  ${SideBase};
  z-index: 2;
  position: ${(props) => (props.side === "front" ? "relative" : "absolute")};
  transform: ${(props) =>
    props.direction === "hor"
      ? `rotateY(${props.side === "front" ? 0 : 180}deg)`
      : `rotateX(${props.side === "front" ? 0 : 180}deg)`};
  transition: ${(props) => props.alpha}s;
`;

const Back = styled("div")<{
  side: Sides;
  direction: FlipDirection;
  alpha: number;
}>`
  ${SideBase};
  position: ${(props) => (props.side === "front" ? "absolute" : "relative")};
  transform: ${(props) =>
    props.direction === "hor"
      ? `rotateY(${props.side === "front" ? -180 : 0}deg)`
      : `rotateX(${props.side === "front" ? -180 : 0}deg)`};
  transition: ${(props) => props.alpha}s;
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

export default VocabCardFlipperBase;
