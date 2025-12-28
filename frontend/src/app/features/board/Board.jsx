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

	// ✅ FIXED: Handle task click properly
	const handleTaskClick = (task) => {
		console.log("🎯 Task clicked:", task.title);
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	if (!board) return null;

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">

				{/* Header */}
				<div className="flex items-center justify-between p-6 pb-4 pt-0">
					<div>
						<h2 className="text-2xl font-bold">
							{board.title}
						</h2>
					</div>
				</div>

				{/* ✅ FIXED: Columns container - REMOVE overflow-x-auto */}
				<div className="flex-1 flex gap-6 px-6">
					{board.columns.map(column => (
						<TaskColumn
							key={column.id}
							columnId={column.id}
							title={column.title}
							tasks={column.tasks}
							onTaskClick={handleTaskClick} // ✅ Prop properly passed
						/>
					))}
				</div>

				<TaskBar boardId={board.id} />

				{/* ✅ Modal for task details */}
				{isModalOpen && selectedTask && (
					<div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center">
						<div className="bg-white rounded-lg p-6 w-96 max-w-md">
							<h2 className="text-xl font-bold mb-4">Task Details</h2>
							<div className="space-y-3">
								<p><strong>Title:</strong> {selectedTask.title}</p>
								<p><strong>ID:</strong> {selectedTask.id}</p>
								<p><strong>Status:</strong> {selectedTask.status}</p>
								<p><strong>Priority:</strong> {selectedTask.priority || 'none'}</p>
								{selectedTask.description && (
									<p><strong>Description:</strong> {selectedTask.description}</p>
								)}
								{selectedTask.dueDate && (
									<p><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
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
										// Yahan aap edit modal open kar sakte hain
										console.log("Edit task:", selectedTask.id);
										setIsModalOpen(false);
										// Yahan aap TaskAdderForm open kar sakte hain edit mode mein
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