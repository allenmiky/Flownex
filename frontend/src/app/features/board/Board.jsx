import TaskBar from "./TaskBar/TaskBar";
import TaskColumn from "./Column/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Store } from "../../data/store";
import { useParams } from "react-router-dom";

export default function Board() {
	const { id } = useParams();
	const [board, setBoard] = useState(() => Store.getBoardById(id));
	const [selectedTask, setSelectedTask] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const loadBoard = () => {
			setBoard(Store.getBoardById(id));
		};

		loadBoard();
		window.addEventListener("storage-update", loadBoard);
		return () => window.removeEventListener("storage-update", loadBoard);
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

	// ✅ IMPORTANT: Yeh function properly define karein
	const handleTaskClick = (task) => {
		console.log("🎯 Task clicked in Board.jsx:", task);
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	if (!board) return null;

	console.log("🏢 Board rendering, passing handleTaskClick to columns");

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
					{board.columns.map(column => {
						console.log("📥 Passing onTaskClick to column:", column.id);
						return (
							<TaskColumn
								key={column.id}
								columnId={column.id}
								title={column.title}
								tasks={column.tasks}
								onTaskClick={handleTaskClick} // ✅ YEH LINE BHI IMPORTANT
							/>
						);
					})}
				</div>

				<TaskBar boardId={board.id} />

				{/* ✅ Simple Test Modal */}
				{isModalOpen && selectedTask && (
					<div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center">
						<div className="bg-white rounded-lg p-6 w-96 max-w-md">
							<h2 className="text-xl font-bold mb-4">Task Details</h2>
							<div className="space-y-3">
								<p><strong>Title:</strong> {selectedTask.title}</p>
								<p><strong>ID:</strong> {selectedTask.id}</p>
								<p><strong>Status:</strong> {selectedTask.status}</p>
								<p><strong>Priority:</strong> {selectedTask.priority}</p>
								{selectedTask.description && (
									<p><strong>Description:</strong> {selectedTask.description}</p>
								)}
							</div>
							<div className="flex justify-end gap-3 mt-6">
								<button
									onClick={() => setIsModalOpen(false)}
									className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
								>
									Close
								</button>
								<button
									onClick={() => {
										// Edit functionality yahan add karein
										console.log("Edit task:", selectedTask.id);
										setIsModalOpen(false);
									}}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Edit Task
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</DragDropContext>
	);
}