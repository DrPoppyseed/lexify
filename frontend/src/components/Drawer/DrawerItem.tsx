import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import produce from "immer";
import { ListItemText, MenuItem } from "@mui/material";
import { z } from "zod";
import { collectionState } from "../../state/collectionsState";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const drawerItemSchema = z.object({
  name: z.string(),
});

export type DrawerItemForm = z.infer<typeof drawerItemSchema>;

const DrawerItem: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const [collection, setCollection] = useRecoilState(collectionState(id));
  const { setItemToLocalStorage } = useLocalStorage();
  const { register, handleSubmit } = useForm<DrawerItemForm>({
    resolver: zodResolver(drawerItemSchema),
  });

  const onSubmit: SubmitHandler<DrawerItemForm> = (formData) => {
    setCollection((prev) =>
      produce(prev, (draft) => {
        draft.name = formData.name;
      })
    );
  };

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
