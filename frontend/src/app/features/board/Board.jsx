import TaskBar from "./TaskBar/TaskBar";
import TaskColumn from "./Column/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Store } from "../../data/store";
import { useParams, useNavigate } from "react-router-dom";

export default function Board() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [board, setBoard] = useState(() => Store.getBoardById(id));
	const [selectedTask, setSelectedTask] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [allBoards, setAllBoards] = useState([]);

	useEffect(() => {
		const loadBoard = () => {
			const boardData = Store.getBoardById(id);
			setBoard(boardData);
			
			// Saare boards get karein
			const boards = Store.getBoards();
			setAllBoards(boards);
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

	// ✅ Task click handler
	const handleTaskClick = (task) => {
		console.log("🎯 Task clicked in Board.jsx:", task);
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	// ✅ Create first board handler
	const handleCreateFirstBoard = () => {
		const newBoardId = Store.addBoard("My First Board");
		navigate(`/board/${newBoardId}`);
	};

	// ✅ Agar koi board nahi hai (first time user)
	const showEmptyState = !allBoards || allBoards.length === 0 || 
		(allBoards.length === 1 && allBoards[0].id === "default" && 
		 allBoards[0].columns.every(col => col.tasks.length === 0));

	if (showEmptyState) {
		return (
			<div className="h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
				<div className="text-center max-w-md mx-auto">
					{/* Illustration */}
					<div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-color)]">
						<svg 
							className="w-12 h-12 text-[var(--text-secondary)]" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth="1.5" 
								d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
							/>
						</svg>
					</div>
					
					{/* Title */}
					<h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
						Add your first board
					</h1>
					
					{/* Description */}
					<p className="text-[var(--text-secondary)] mb-8">
						Get started by creating your first board. Organize your tasks, 
						track progress, and collaborate with your team.
					</p>
					
					{/* Buttons */}
					<div className="flex flex-col gap-4">
						<button
							onClick={handleCreateFirstBoard}
							className="px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:brightness-110 transition-all shadow-md"
						>
							Create Your First Board
						</button>
						
						<button
							onClick={() => {
								// Sample board with demo data
								const sampleBoardId = Store.addBoard("Sample Board");
								navigate(`/board/${sampleBoardId}`);
								
								// Add sample tasks
								Store.addTask(sampleBoardId, {
									title: "Welcome to FlowNex!",
									description: "This is a sample task to get you started.",
									status: "todo",
									priority: "medium"
								});
								
								Store.addTask(sampleBoardId, {
									title: "Drag tasks between columns",
									description: "Try dragging this task to 'In Progress'",
									status: "todo",
									priority: "low"
								});
								
								Store.addTask(sampleBoardId, {
									title: "Click on tasks to edit",
									description: "Click any task to see details and edit them",
									status: "inprogress",
									priority: "high"
								});
							}}
							className="px-8 py-3 border-2 border-[var(--accent)] text-[var(--accent)] rounded-lg font-semibold hover:bg-[var(--accent)] hover:text-white transition-all"
						>
							Try Sample Board
						</button>
					</div>
				</div>
			</div>
		);
	}

	// ✅ Agar board nahi mila (invalid ID)
	if (!board) {
		return (
			<div className="h-screen flex items-center justify-center bg-[var(--bg-primary)]">
				<div className="text-center">
					<h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
						Board not found
					</h1>
					<button
						onClick={() => navigate("/")}
						className="text-[var(--accent)] hover:underline"
					>
						Go back to home
					</button>
				</div>
			</div>
		);
	}

	// ✅ Regular board view (existing code)
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
					{board.columns.map(column => (
						<TaskColumn
							key={column.id}
							columnId={column.id}
							title={column.title}
							tasks={column.tasks}
							onTaskClick={handleTaskClick}
						/>
					))}
				</div>

				<TaskBar boardId={board.id} />

				{/* Task Details Modal */}
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