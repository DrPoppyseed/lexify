import { IconButton, Toolbar } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { isDrawerOpenState } from "../state/isDrawerOpen";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);

  const handleDrawerClick = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Toolbar>
      {!isDrawerOpen && (
        <IconButton onClick={handleDrawerClick}>
          <Menu />
        </IconButton>
      )}
    </Toolbar>
  );
};

export default Header;
