import TaskBar from "./TaskBar/TaskBar";
import TaskColumn from "./Column/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Store } from "../../data/store";

export default function Board() {
	const [board, setBoard] = useState(Store.getBoard());
	const [showColumnModal, setShowColumnModal] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState("");

	// Load and listen for updates
	useEffect(() => {
		const loadBoard = () => {
			setBoard(Store.getBoard());
		};

		// Initial load
		loadBoard();

		// Listen for storage updates
		window.addEventListener('storage-update', loadBoard);

		return () => {
			window.removeEventListener('storage-update', loadBoard);
		};
	}, []);

	const handleDragEnd = (result) => {
		if (!result.destination) return;

		const { source, destination, draggableId } = result;

		if (source.droppableId === destination.droppableId) {
			// Reorder within same column
			const column = board.columns.find(col => col.id === source.droppableId);
			if (!column) return;

			const newTasks = Array.from(column.tasks);
			const [movedTask] = newTasks.splice(source.index, 1);
			newTasks.splice(destination.index, 0, movedTask);

			// Update in Store
			Store.reorderTasks(source.droppableId, newTasks);
		} else {
			// Move to different column
			Store.moveTask(
				draggableId,
				source.droppableId,
				destination.droppableId,
				destination.index
			);
		}
	};

	const handleAddColumn = () => {
		if (!newColumnTitle.trim()) return;

		Store.addColumn(newColumnTitle.trim());
		setNewColumnTitle("");
		setShowColumnModal(false);
	};

	const handleAddTask = (columnId, taskData) => {
		const taskToAdd = {
			...taskData,
			status: columnId
		};
		Store.addTask(taskToAdd);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="h-full flex flex-col bg-[var(--bg-primary)]">
				<TaskBar />

				{/* Board Header */}
				<div className="flex items-center justify-between p-4 mb-4">
					<div>
						<h2 className="text-xl font-semibold text-[var(--text-primary)]">
							{board.title}
						</h2>
						<p className="text-sm text-[var(--text-secondary)] mt-1">
							{board.columns.reduce((total, col) => total + col.tasks.length, 0)} total tasks
						</p>
					</div>
					<div className="flex items-center gap-2">
						<button className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm hover:bg-[var(--bg-muted)]">
							Filter
						</button>
						<button className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm hover:bg-[var(--accent-hover)]">
							Share
						</button>
					</div>
				</div>

				{/* Columns Container */}
				<div className="flex-1 flex gap-4 overflow-x-auto px-4 pb-20 min-h-[calc(100vh-140px)]">
					{board.columns.map((column) => (
						<TaskColumn
							key={column.id}
							columnId={column.id}
							title={column.title}
							tasks={column.tasks}
							onAddTask={(taskData) => handleAddTask(column.id, taskData)}
						/>
					))}

					{/* Add New Column Button */}
					<div className="flex-shrink-0 w-72">
						<button
							onClick={() => setShowColumnModal(true)}
							className="w-full p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2"
						>
							<span className="text-xl">+</span>
							Add another list
						</button>
					</div>
				</div>

				{/* Add Column Modal */}
				{showColumnModal && (
					<>
						<div className="fn-overlay" onClick={() => setShowColumnModal(false)} />
						<div className="fn-modal fn-card" style={{ maxWidth: "400px" }}>
							<h3 className="fn-modal-title">Add New Column</h3>

							<div className="mb-4">
								<label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
									Column Title
								</label>
								<input
									autoFocus
									className="fn-input"
									placeholder="Enter column title..."
									value={newColumnTitle}
									onChange={(e) => setNewColumnTitle(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
								/>
							</div>

							<div className="fn-actions">
								<button
									className="fn-btn-secondary"
									onClick={() => setShowColumnModal(false)}
								>
									Cancel
								</button>
								<button
									className="fn-btn"
									onClick={handleAddColumn}
									disabled={!newColumnTitle.trim()}
								>
									Add Column
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</DragDropContext>
	);
}