import {
  Active,
  DndContext,
  Over,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Add, Menu } from "@mui/icons-material";
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem as MuiMenuItem,
  SwipeableDrawer,
  styled,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Collection } from "../../api/types";
import { useAppState } from "../../hooks/useAppState";
import {
  useCreateCollection,
  useUpdateCollections,
} from "../../hooks/useCollection";
import { moveInPlace } from "../../utils";
import { CollectionItem } from "./CollectionItem";
import DrawerItem from "./DrawerItem";

const activationConstraint = {
  delay: 150,
  tolerance: 5,
};

const Drawer: FC<{
  collections?: ReadonlyArray<Collection>;
  width?: number;
}> = ({ collections, width = 30 }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useAppState();
  const { createCollection } = useCreateCollection();
  const { updateCollections } = useUpdateCollections();
  const navigate = useNavigate();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint })
  );

  const [shallowCollections, setShallowCollections] =
    useState<ReadonlyArray<Collection> | null>(null);

  useEffect(() => {
    if (collections) {
      setShallowCollections(collections);
    }
  }, [collections]);

  const onClickCreateCollection = async () => {
    await createCollection();
  };

  const handleDragEnd = ({
    active,
    over,
  }: {
    active: Active;
    over: Over | null;
  }) => {
    if (!active) {
      return;
    }

    if (collections && active.id !== over?.id) {
      const collection = collections.find(({ id }) => id === active.id);
      if (collection && over?.id) {
        // console.log("dragging!", collection, over?.id);
        const updatedCollections = moveInPlace(
          [...collections],
          collection,
          active.id.toString(),
          over.id.toString()
        );
        setShallowCollections(updatedCollections);
        updateCollections(updatedCollections);
      }
    }
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
        {shallowCollections && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={shallowCollections.map((collection) => collection.id)}
            >
              {shallowCollections.map((collection) => (
                <CollectionItem
                  key={collection.id}
                  id={collection.id}
                  name={collection.name}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
        <MenuItem onClick={() => onClickCreateCollection()}>
          <ListItemIcon>
            <Add fontSize="small" color="disabled" />
          </ListItemIcon>
          <ListItemText color="disabled" primary="New Node" />
        </MenuItem>
      </MenuList>
      <Spacer />
      <Divider />
      <DrawerFooter>
        <DrawerItem text="Account" onClick={() => navigate("/account")} />
      </DrawerFooter>
    </DrawerBase>
  );
};

const DrawerBase = styled(SwipeableDrawer)<{ width: number }>`
  width: ${({ theme, width }) => theme.spacing(width)};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

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

const DrawerFooter = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(12)};
`;

const MenuItem = styled(MuiMenuItem)`
  & .MuiListItemText-primary {
    font-family: Arial, sans-serif;
    color: ${({ theme }) => theme.palette.text.disabled};
  }
`;

const Spacer = styled("div")`
  flex-grow: 1;
`;

export default Drawer;
