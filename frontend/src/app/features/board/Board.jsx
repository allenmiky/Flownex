import TaskBar from "./TaskBar/TaskBar";
import TaskColumn from "./Column/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Store } from "../../data/store";

export default function Board() {
	const [board, setBoard] = useState(Store.getBoard());

	useEffect(() => {
		const loadBoard = () => setBoard(Store.getBoard());
		loadBoard();
		window.addEventListener('storage-update', loadBoard);
		return () => window.removeEventListener('storage-update', loadBoard);
	}, []);

	const handleDragEnd = (result) => {
		if (!result.destination) return;
		const { source, destination, draggableId } = result;

		if (source.droppableId === destination.droppableId) {
			const column = board.columns.find(col => col.id === source.droppableId);
			if (!column) return;
			const newTasks = Array.from(column.tasks);
			const [movedTask] = newTasks.splice(source.index, 1);
			newTasks.splice(destination.index, 0, movedTask);
			Store.reorderTasks(source.droppableId, newTasks);
		} else {
			Store.moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
		}
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			{/* Main Container: 
               'h-screen' aur 'overflow-hidden' poori screen ko control mein rakhte hain.
               'relative' TaskBar ki positioning ke liye zaroori hai.
            */}
			<div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden relative">

				{/* 1. Header Section: Static (Top par hi rahega) */}
				<div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
					<div>
						<h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
							{board.title}
						</h2>
						<div className="flex items-center gap-2 mt-1">
							<span className="flex h-2 w-2 rounded-full bg-green-500"></span>
							<p className="text-sm font-medium text-[var(--text-secondary)]">
								{board.columns.reduce((total, col) => total + col.tasks.length, 0)} Active Tasks
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex -space-x-2 mr-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--accent)] flex items-center justify-center text-[10px] font-bold text-white">
									U{i}
								</div>
							))}
						</div>
						<button className="h-9 px-4 rounded-lg bg-[var(--accent)] text-white text-xs font-bold hover:opacity-90 transition-opacity">
							Share Board
						</button>
					</div>
				</div>

				{/* 2. Columns Container: 
                   'flex-1' poori bachi hui height le lega.
                   'pb-28' bohot zaroori hai taake aakhri card TaskBar ke piche na chhup jaye.
                   'items-start' se columns apni natural height lenge.
                */}
				<div className="flex-1 flex gap-6 overflow-x-auto px-6 overflow-y-hidden custom-scrollbar items-start">
					{board.columns.map((column) => (
						<TaskColumn
							key={column.id}
							columnId={column.id}
							title={column.title}
							tasks={column.tasks}
							onAddTask={() => console.log("Add Task Clicked")}
						/>
					))}

					{/* Static Create New List Box */}
					<div className="flex-shrink-0 w-80">
						<div className="w-full h-[120px] rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]/30 flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer group">
							<div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white">
								+
							</div>
							<span className="text-xs font-bold uppercase tracking-widest">New List</span>
						</div>
					</div>
				</div>

				{/* 3. TaskBar: 
                   Isko div ke end mein rakha hai taake ye layers mein sab se opper ho.
                   Iske andar 'fixed' position hai toh ye hamesha bottom par float karegi.
                */}
				<TaskBar />
			</div>
		</DragDropContext>
	);
}