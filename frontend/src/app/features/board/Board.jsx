import { useEffect, useState } from "react";
import { Store } from "../../data/store";
import { useParams, useNavigate } from "react-router-dom";
import TaskBar from "./TaskBar/TaskBar";
import TaskColumn from "./Column/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";

export default function Board() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [board, setBoard] = useState(null);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [allBoards, setAllBoards] = useState([]);

	useEffect(() => {
		const loadData = () => {
			const boards = Store.getBoards();
			setAllBoards(boards);

			if (id) {
				const boardData = Store.getBoardById(id);
				setBoard(boardData);
			}

			setHasLoaded(true);
		};

		loadData();
		window.addEventListener("storage-update", loadData);
		return () => window.removeEventListener("storage-update", loadData);
	}, [id]);

	// Loading state - thoda sa bhi flash nahi dikhega
	if (!hasLoaded) {
		return null; // ✅ Kuch nahi dikhega, directly boards load honge
	}

	// EMPTY STATE - Sirf tab dikhega jab koi board nahi hai
	if (allBoards.length === 0) {
		return (
			<div className="h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
				<div className="text-center max-w-md mx-auto">
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

					<h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
						Add your first board
					</h1>

					<p className="text-[var(--text-secondary)] mb-8">
						Get started by creating your first board.
					</p>

					<button
						onClick={() => {
							const newBoardId = Store.addBoard("My First Board");
							navigate(`/board/${newBoardId}`);
						}}
						className="px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:brightness-110 transition-all shadow-md"
					>
						Create Your First Board
					</button>
				</div>
			</div>
		);
	}

	// ✅ Agar user ne koi specific board select nahi kiya, toh pehla board dikhao
	if (!id && allBoards.length > 0) {
		useEffect(() => {
			navigate(`/board/${allBoards[0].id}`, { replace: true });
		}, [id, allBoards, navigate]);
		return null;
	}

	// ✅ Agar board ID hai par board nahi mila (invalid URL)
	if (id && !board) {
		// Invalid board ID hai, toh pehle valid board par redirect karo
		useEffect(() => {
			if (allBoards.length > 0) {
				navigate(`/board/${allBoards[0].id}`, { replace: true });
			}
		}, [id, allBoards, navigate]);
		return null;
	}

	// ✅ REGULAR BOARD VIEW - DIRECTLY Dikhega agar boards hain
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

	const handleTaskClick = (task) => {
		console.log("🎯 Task clicked:", task);
		// Yahan modal ya edit form open karein
	};

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
			</div>
		</DragDropContext>
	);
}