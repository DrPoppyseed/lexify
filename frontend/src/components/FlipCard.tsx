import { FC, ReactNode } from "react";
import styled from "@emotion/styled";
import { Sides } from "../types/Sides";

type FlipDirection = "hor" | "ver";

type Props = {
  side: Sides;
  front: ReactNode;
  back: ReactNode;
  zIndex?: string;
  alpha?: number;
  direction?: FlipDirection;
};

const FlipCard: FC<Props> = ({
  zIndex = "auto",
  side,
  direction = "hor",
  alpha = 0.3,
  front,
  back,
}) => (
  <FlipCardContainer zIndex={zIndex}>
    <Flipper>
      <Front alpha={alpha} side={side} direction={direction}>
        {front}
      </Front>
      <Back alpha={alpha} side={side} direction={direction}>
        {back}
      </Back>
    </Flipper>
  </FlipCardContainer>
);

const FlipCardContainer = styled.div<{ zIndex: string }>`
  perspective: 1000px;
  z-index: ${(props) => props.zIndex};
  height: 100%;
`;

const Flipper = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;

const Front = styled.div<{
  side: Sides;
  direction: FlipDirection;
  alpha: number;
}>`
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 2;
  position: ${(props) => (props.side === "front" ? "relative" : "absolute")};
  transform: ${(props) =>
    props.direction === "hor"
      ? `rotateY(${props.side === "front" ? 0 : 180}deg)`
      : `rotateX(${props.side === "front" ? 0 : 180}deg)`};
  transform-style: preserve-3d;
  transition: ${(props) => props.alpha}s;
  backface-visibility: hidden;
`;

const Back = styled.div<{
  side: Sides;
  direction: FlipDirection;
  alpha: number;
}>`
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  position: ${(props) => (props.side === "front" ? "absolute" : "relative")};
  transform: ${(props) =>
    props.direction === "hor"
      ? `rotateY(${props.side === "front" ? -180 : 0}deg)`
      : `rotateX(${props.side === "front" ? -180 : 0}deg)`};
  transform-style: preserve-3d;
  transition: ${(props) => props.alpha}s;
  backface-visibility: hidden;
`;

export default FlipCard;
