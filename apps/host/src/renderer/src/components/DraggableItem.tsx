import { useSortable } from "@dnd-kit/react/sortable";

type DraggableItemProps = {
  id: string;
  index: number;
  children: ({
    isDragging,
    handler,
  }: {
    isDragging: boolean;
    handler: (element: Element | null) => void;
  }) => React.ReactNode;
};

export default function DraggableItem({ id, index, children }: DraggableItemProps) {
  const { ref, isDragging, handleRef } = useSortable({
    id,
    index,
  });

  return <div ref={ref}>{children({ isDragging, handler: handleRef })}</div>;
}
