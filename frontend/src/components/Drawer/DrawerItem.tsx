import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ListItemText, MenuItem } from "@mui/material";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Collection } from "../../api/types";

const DrawerItem: FC<{ collection: Collection }> = ({ collection }) => {
  const navigate = useNavigate();
  const { setItemToLocalStorage } = useLocalStorage();

  const onDrawerItemClick = () => {
    navigate(`/${collection.id}`);
    setItemToLocalStorage("latestAccessedCollectionId", collection.id);
  };

  return (
    <MenuItem onClick={onDrawerItemClick}>
      <ListItemText primary={collection.name} />
    </MenuItem>
  );
};

export default DrawerItem;
