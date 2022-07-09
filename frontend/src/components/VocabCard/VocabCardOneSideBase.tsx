import { Card, styled } from "@mui/material";
import { FC, ReactNode } from "react";
import { useRecoilState } from "recoil";
import { isShakingState } from "../../state/vocabCardState";
import { Sides } from "../../types/Sides";

type VocabCardOneSideBaseProps = {
  children: ReactNode;
  setSide: (side: Sides | ((prev: Sides) => Sides)) => void;
};

const VocabCardOneSideBase: FC<VocabCardOneSideBaseProps> = ({
  setSide,
  children,
}) => {
  const [isShaking, setIsShaking] = useRecoilState(isShakingState);

  let currentTimeout = 0;

  const clearPreviousTimeout = () => {
    if (currentTimeout) clearTimeout(currentTimeout);
  };

  return (
    <CardBase
      variant="outlined"
      onClick={(e) => {
        e.stopPropagation();
        if (!isShaking) {
          clearPreviousTimeout();
          // prevent card from flipping when shaking
          setSide((prev) => (prev === "front" ? "back" : "front"));
        }
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
      {children}
    </CardBase>
  );
};

const CardBase = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: ${({ theme }) => theme.spacing(16)};
`;

export default VocabCardOneSideBase;
