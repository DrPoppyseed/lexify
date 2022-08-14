import { IconButton, styled, Toolbar as MuiToolbar } from "@mui/material";
import { Menu, MoreVert } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { isDrawerOpenState } from "../state/pageState";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);

  const handleDrawerClick = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Toolbar>
      {!isDrawerOpen ? (
        <IconButton onClick={handleDrawerClick}>
          <Menu />
        </IconButton>
      ) : (
        // keep this element so flex behaves the same way regardless of drawer state
        <div />
      )}
      <IconButton onClick={() => console.log("yo")}>
        <MoreVert />
      </IconButton>
    </Toolbar>
  );
};

const Toolbar = styled(MuiToolbar)`
  display: flex;
  justify-content: space-between;
`;

export default Header;
