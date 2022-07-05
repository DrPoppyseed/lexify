import { styled } from "@mui/material";
import React, { FC } from "react";

type RippleCircleProps = {
  alpha?: number;
  color?: string;
  size?: number;
};

const RippleCircle: FC<RippleCircleProps> = ({
  alpha = 1.2,
  color = "#7ef9ff",
  size = 2,
}) => (
  <RippleCircleBase alpha={alpha} color={color} size={size}>
    <span />
    <span />
    <span />
  </RippleCircleBase>
);

const RippleCircleBase = styled("div")<{
  alpha: number;
  color: string;
  size: number;
}>`
  position: relative;

  & > span {
    width: ${({ theme, size }) => theme.spacing(size)};
    height: ${({ theme, size }) => theme.spacing(size)};
    background: ${({ color }) => color};
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;

    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: inherit;
      border-radius: inherit;
      animation: ${({ alpha }) => `ripple ${alpha}s ease-out infinite`};
    }

    &:nth-of-type(1) {
      &::before {
        animation-delay: 0.2s;
      }
    }

    &:nth-of-type(2) {
      &::before {
        animation-delay: 0.4s;
      }
    }

    &:nth-of-type(3) {
      &::before {
        animation-delay: 0.5s;
      }
    }
  }

  @keyframes ripple {
    50%,
    75% {
      transform: scale(2);
    }

    80%,
    100% {
      opacity: 0;
    }
  }
`;

export default RippleCircle;
