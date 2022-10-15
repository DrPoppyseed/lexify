import { FC, MouseEvent, ReactNode } from "react";
import { Card, css, Grid, styled } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sides } from "../../types/Sides";

type FlipDirection = "hor" | "ver";

const VocabCardBase: FC<{
  front: ReactNode;
  back: ReactNode;
  id: string;
  setSide: (side: Sides | ((prev: Sides) => Sides)) => void;
  side: Sides;
}> = ({ setSide, side, front, back, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const alpha = 0.3;
  const direction = "hor";

  const onRemoveVocabCardClicked = (e?: MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    // TODO: Remove vocab card
  };

  return (
    <CardContainer
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSide((prev) => (prev === "front" ? "back" : "front"));
      }}
      item
      xs={12}
      md={6}
      xl={4}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <FlipCardContainer zIndex="auto">
        <Flipper>
          <Front alpha={alpha} side={side} direction={direction}>
            <CardBase>{front}</CardBase>
          </Front>
          <Back alpha={alpha} side={side} direction={direction}>
            <CardBase>{back}</CardBase>
          </Back>
        </Flipper>
      </FlipCardContainer>
    </CardContainer>
  );
};

const CardContainer = styled(Grid)`
  position: relative;
  transform-origin: 50% 100%;

  &:active {
    cursor: grabbing;
  }
`;

const FlipCardContainer = styled("div", {
  shouldForwardProp: (props) => props !== "zIndex",
})<{ zIndex: string }>`
  perspective: 1000px;
  z-index: ${(props) => props.zIndex};
  height: 100%;
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

const CardBase = styled(Card)`
  background-color: #fffcf7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: ${({ theme }) => theme.spacing(16)};
  padding: ${({ theme }) => theme.spacing(2)};
  cursor: pointer;
`;

export default VocabCardBase;
