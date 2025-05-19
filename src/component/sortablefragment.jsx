import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FragmentCard from "./fragments.jsx";
import { useState } from "react";

function SortableFragment({ fragment }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: fragment.id,
    disabled: isModalOpen, 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...(isModalOpen ? {} : { ...attributes, ...listeners })}>
      <FragmentCard fragment={fragment} onModalToggle={setIsModalOpen} />
    </div>
  );
}

export default SortableFragment;
