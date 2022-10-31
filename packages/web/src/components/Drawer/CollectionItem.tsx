import { useSortable } from "@dnd-kit/sortable";
import { FC, MouseEvent } from "react";
import { CSS } from "@dnd-kit/utilities";
import { MenuItem as MuiMenuItem, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const CollectionItem: FC<{ id: string; name: string }> = ({ id, name }) => {
  const navigate = useNavigate();
  const { setItemToLocalStorage } = useLocalStorage();
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({
      id,
    });

  const onCollectionClick = (e: MouseEvent, collectionId: string) => {
    e.stopPropagation();
    navigate(`/${collectionId}`);
    setItemToLocalStorage("latestAccessedCollectionId", collectionId);
  };

  return (
    <MenuItem
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={(e) => onCollectionClick(e, id)}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {name}
    </MenuItem>
  );
};

const MenuItem = styled(MuiMenuItem)`
  border-radius: 4px;
  width: 100%;

  cursor: pointer;
  &:active {
    touch-action: manipulation;
    cursor: grabbing;
  }
`;

export default CollectionItem;
