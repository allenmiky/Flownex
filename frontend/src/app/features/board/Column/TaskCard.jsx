import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index }) {
	return (
		<Draggable draggableId={task.id} index={index}>
			{(p) => (
				<div
					ref={p.innerRef}
					{...p.draggableProps}
					{...p.dragHandleProps}
					className="rounded-lg bg-white p-2 shadow dark:bg-zinc-800"
				>
					{task.title}
				</div>
			)}
		</Draggable>
	);
}
