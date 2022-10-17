import { Dispatch, FC, MouseEvent, ReactNode, SetStateAction } from "react";
import { css, Grid, styled } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sides } from "../../types/Sides";

type FlipDirection = "hor" | "ver";

const VocabCardBase: FC<{
  front: ReactNode;
  back: ReactNode;
  id: string;
  setSide: Dispatch<SetStateAction<Sides>>;
  side: Sides;
}> = ({ setSide, side, front, back, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({
      id,
    });
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
      <Flipper>
        <Front alpha={alpha} side={side} direction={direction}>
          {front}
        </Front>
        <Back alpha={alpha} side={side} direction={direction}>
          {back}
        </Back>
      </Flipper>
    </CardContainer>
  );
};

const CardContainer = styled(Grid)`
  position: relative;
  transform-origin: 50% 100%;

  z-index: auto;
  cursor: pointer;

  &:active {
    z-index: 999;
  }
`;

const SideBase = css`
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  border: 1px solid lightgrey;
  border-radius: 4px;
  background-color: #fffcf7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  transition: box-shadow 0.5s ease-in-out;
  &:active {
    touch-action: manipulation;
    cursor: grabbing;
    scale: 1.05;
    box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  }
`;

const Flipper = styled("div")`
  height: 100%;
  position: relative;
  width: 100%;
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
  height: ${({ theme }) => theme.spacing(16)};
  padding: ${({ theme }) => theme.spacing(2)};
`;

const Back = styled("div")<{
  side: Sides;
  direction: FlipDirection;
  alpha: number;
}>`
  ${SideBase};
  z-index: 1;
  position: ${(props) => (props.side === "front" ? "absolute" : "relative")};
  transform: ${(props) =>
    props.direction === "hor"
      ? `rotateY(${props.side === "front" ? -180 : 0}deg)`
      : `rotateX(${props.side === "front" ? -180 : 0}deg)`};
  transition: ${(props) => props.alpha}s;
  height: ${({ theme }) => theme.spacing(16)};
  padding: ${({ theme }) => theme.spacing(2)};
`;

export default VocabCardBase;
