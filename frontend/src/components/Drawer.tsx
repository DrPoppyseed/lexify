import { FC } from "react";
import { IconButton, styled, SwipeableDrawer } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { isDrawerOpenState } from "../state/pageState";

type DrawerProps = {
  width?: number;
};

const Drawer: FC<DrawerProps> = ({ width = 30 }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);

  return (
    <DrawerBase
      width={width}
      anchor="left"
      variant="persistent"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      onOpen={() => setIsDrawerOpen(true)}
    >
      <DrawerHeader>
        <IconButton onClick={() => setIsDrawerOpen(false)}>
          <Menu />
        </IconButton>
      </DrawerHeader>
    </DrawerBase>
  );
};

const DrawerBase = styled(SwipeableDrawer)<{ width: number }>`
  width: ${({ theme, width }) => theme.spacing(width)};
  flex-shrink: 0;

  & .MuiDrawer-paper {
    width: ${({ theme, width }) => theme.spacing(width)};
    padding: 0 ${({ theme }) => theme.spacing(2)}
      ${({ theme }) => theme.spacing(2)};
    box-sizing: border-box;
  }
`;

const DrawerHeader = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing(1)};
`;

export default Drawer;
