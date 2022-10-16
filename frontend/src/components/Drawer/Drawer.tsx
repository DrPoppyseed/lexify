import { FC } from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
  MenuList,
  styled,
  SwipeableDrawer,
} from "@mui/material";
import { Add, Menu } from "@mui/icons-material";
import DrawerItem from "./DrawerItem";
import { useCreateCollection } from "../../hooks/useCollection";
import { Collection } from "../../api/types";
import { useAppState } from "../../hooks/useAppState";

const Drawer: FC<{
  collections: ReadonlyArray<Collection>;
  width?: number;
}> = ({ collections, width = 30 }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useAppState();
  const { createCollection } = useCreateCollection();

  const onClickCreateCollection = async () => {
    await createCollection();
  };

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
      <MenuList>
        {collections.map((collection) => (
          <DrawerItem key={collection.id} collection={collection} />
        ))}
        <MenuItem onClick={() => onClickCreateCollection()}>
          <ListItemIcon>
            <Add fontSize="small" color="disabled" />
          </ListItemIcon>
          <ListItemText color="disabled" primary="New Node" />
        </MenuItem>
      </MenuList>
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
    background-color: #fffcf7;
  }
`;

const DrawerHeader = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing(1)};
`;

const MenuItem = styled(MuiMenuItem)`
  & .MuiListItemText-primary {
    font-family: Arial, sans-serif;
    color: ${({ theme }) => theme.palette.text.disabled};
  }
`;

export default Drawer;
