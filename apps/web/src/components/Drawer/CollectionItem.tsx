import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useLocalStorage } from "../../hooks/useLocalStorage";

export const CollectionItem: React.FC<{ id: string; name: string }> = ({
  id,
  name,
}) => {
  const navigate = useNavigate();
  const { setItemToLocalStorage } = useLocalStorage();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const onCollectionClick = (e: MouseEvent, collectionId: string) => {
    e.stopPropagation();
    navigate(`/${collectionId}`);
    setItemToLocalStorage("latestAccessedCollectionId", collectionId);
  };

  return (
    <button
      className="br-2 w-full cursor-pointer active:touch-action-manipulation active:cursor-grabbing"
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
    </button>
  );
};
