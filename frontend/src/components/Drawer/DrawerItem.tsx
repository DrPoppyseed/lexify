import { FC, MouseEventHandler } from "react";
import { ListItemText, MenuItem as MuiMenuItem, styled } from "@mui/material";

const DrawerItem: FC<{
  text: string;
  onClick: MouseEventHandler;
}> = ({ text, onClick }) => (
  <MenuItem onClick={onClick}>
    <ListItemText primary={text} />
  </MenuItem>
);

const MenuItem = styled(MuiMenuItem)`
  border-radius: 4px;
  width: 100%;
`;

export default DrawerItem;
