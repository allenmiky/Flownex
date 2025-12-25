import TaskBar from "./TaskBar/TaskBar";
import TaskColumn from "./Column/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";

export default function Board() {
	const [columns, setColumns] = useState([
		{
			id: "todo",
			title: "To Do",
			tasks: [
				{ id: "1", title: "Design marketing banners" },
				{ id: "2", title: "Write social media posts" },
				{ id: "3", title: "Prepare campaign presentation" },
			],
		},
		{
			id: "inprogress",
			title: "In Progress",
			tasks: [
				{ id: "4", title: "Create campaign timeline" },
				{ id: "5", title: "Draft email newsletter" },
			],
		},
		{
			id: "review",
			title: "Review",
			tasks: [
				{ id: "6", title: "Review campaign budget" },
			],
		},
		{
			id: "done",
			title: "Done",
			tasks: [
				{ id: "7", title: "Finalize target audience" },
				{ id: "8", title: "Set campaign goals" },
			],
		},
	]);

	const handleDragEnd = (result) => {
		if (!result.destination) return;

		const { source, destination } = result;

		if (source.droppableId === destination.droppableId) {
			const columnIndex = columns.findIndex(col => col.id === source.droppableId);
			const newTasks = Array.from(columns[columnIndex].tasks);
			const [movedTask] = newTasks.splice(source.index, 1);
			newTasks.splice(destination.index, 0, movedTask);

			const newColumns = [...columns];
			newColumns[columnIndex] = {
				...newColumns[columnIndex],
				tasks: newTasks,
			};
			setColumns(newColumns);
		} else {
			const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
			const destColIndex = columns.findIndex(col => col.id === destination.droppableId);

			const sourceTasks = Array.from(columns[sourceColIndex].tasks);
			const destTasks = Array.from(columns[destColIndex].tasks);

			const [movedTask] = sourceTasks.splice(source.index, 1);
			destTasks.splice(destination.index, 0, movedTask);

			const newColumns = [...columns];
			newColumns[sourceColIndex] = {
				...newColumns[sourceColIndex],
				tasks: sourceTasks,
			};
			newColumns[destColIndex] = {
				...newColumns[destColIndex],
				tasks: destTasks,
			};
			setColumns(newColumns);
		}
	};

	const addNewColumn = () => {
		const newColumnId = `column-${Date.now()}`;
		const newColumn = {
			id: newColumnId,
			title: "New Column",
			tasks: []
		};
		setColumns([...columns, newColumn]);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="h-full flex flex-col bg-[var(--bg-primary)]">
				<TaskBar />

				{/* Board Header */}
				<div className="flex items-center justify-between p-4 mb-4">
					<h2 className="text-xl font-semibold text-[var(--text-primary)]">
						Marketing Campaign
					</h2>
					<div className="flex items-center gap-2">
						<button className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm">
							Filter
						</button>
						<button className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm hover:bg-[var(--accent-hover)]">
							Share
						</button>
					</div>
				</div>

				{/* Columns Container */}
				<div className="flex-1 flex gap-4 overflow-x-auto px-4 pb-20 min-h-[calc(100vh-140px)]">
					{columns.map((column) => (
						<TaskColumn
							key={column.id}
							columnId={column.id}
							title={column.title}
							tasks={column.tasks}
						/>
					))}

					{/* Add New Column Button */}
					<div className="flex-shrink-0 w-72">
						<button
							onClick={addNewColumn}
							className="w-full p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2"
						>
							<span className="text-xl">+</span>
							Add another list
						</button>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
}