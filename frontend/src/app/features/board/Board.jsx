import TaskBar from "./TaskBar/TaskBar";
import TaskColumn from "./Column/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Store } from "../../data/store";
import { useParams } from "react-router-dom";

export default function Board() {
	const { id } = useParams(); // 👈 board id from URL
	const [board, setBoard] = useState(() =>
		Store.getBoardById(id)
	);

	useEffect(() => {
		const loadBoard = () => {
			setBoard(Store.getBoardById(id));
		};

		loadBoard();
		window.addEventListener("storage-update", loadBoard);
		return () =>
			window.removeEventListener("storage-update", loadBoard);
	}, [id]);

	const handleDragEnd = (result) => {
		if (!result.destination) return;

		const { source, destination, draggableId } = result;

		if (source.droppableId === destination.droppableId) {
			const column = board.columns.find(
				col => col.id === source.droppableId
			);
			if (!column) return;

			const newTasks = Array.from(column.tasks);
			const [moved] = newTasks.splice(source.index, 1);
			newTasks.splice(destination.index, 0, moved);

			Store.reorderTasks(
				column.id,
				newTasks,
				board.id
			);
		} else {
			Store.moveTask(
				draggableId,
				source.droppableId,
				destination.droppableId,
				destination.index,
				board.id
			);
		}
	};

	if (!board) return null;

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden relative">

				{/* Header */}
				<div className="flex items-center justify-between p-6 pb-4 pt-0">
					<div>
						<h2 className="text-2xl font-bold">
							{board.title}
						</h2>
					</div>
				</div>

				{/* Columns */}
				<div className="flex-1 flex gap-6 overflow-x-auto px-6">
					{board.columns.map(column => (
						<TaskColumn
							key={column.id}
							columnId={column.id}
							title={column.title}
							tasks={column.tasks}
						/>
					))}
				</div>

				<TaskBar boardId={board.id} />
			</div>
		</DragDropContext>
	);
}