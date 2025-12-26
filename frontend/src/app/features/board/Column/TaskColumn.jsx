import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { useState } from "react";

export default function TaskColumn({ columnId, title, tasks, onAddTask }) {
	const [showTaskAdder, setShowTaskAdder] = useState(false);

	return (
		<div className="flex-shrink-0 w-72 flex flex-col max-h-full">
			{/* 1. Header: Hamesha top par rahega */}
			<div className="flex items-center justify-between mb-3 p-2 flex-shrink-0">
				<div className="flex items-center gap-2 flex-1">
					<div className="w-3 h-3 rounded-[var(--radius-sm)] bg-[var(--accent)]"></div>
					<h3 className="text-sm font-semibold text-[var(--text-primary)]">
						{title}
					</h3>
					<span className="text-xs px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--bg-muted)] text-[var(--text-secondary)]">
						{tasks.length}
					</span>
				</div>
				<button className="p-1 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]">
					⋮
				</button>
			</div>

			{/* 2. Scrollable Container: Isme Droppable area hai */}
			<div className="flex-1 overflow-y-auto overflow-x-hidden px-1 custom-scrollbar">
				<Droppable droppableId={columnId}>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className={`rounded-[var(--radius-lg)] border min-h-[50px] p-3 transition-colors ${snapshot.isDraggingOver
								? "border-dashed border-[var(--accent)] bg-[rgba(var(--accent),0.05)]"
								: "border-solid border-[var(--border-color)] bg-[var(--bg-secondary)]"
								}`}
						>
							{/* Tasks List */}
							<div className="flex flex-col gap-2">
								{tasks.map((task, index) => (
									<TaskCard
										key={task.id}
										task={task}
										index={index}
									/>
								))}
							</div>

							{provided.placeholder}

							{/* Empty state */}
							{tasks.length === 0 && !snapshot.isDraggingOver && (
								<div className="text-center py-8 text-[var(--text-secondary)] text-sm">
									No tasks yet
								</div>
							)}
						</div>
					)}
				</Droppable>
			</div>

			{/* 3. Footer: Hamesha niche rahega (Add Card Button) */}
			<div className="flex-shrink-0 p-2">
				{showTaskAdder && (
					<div className="mt-2 animate-in fade-in slide-in-from-top-1">
						<input
							autoFocus
							className="fn-input w-full p-2 text-sm rounded-md border border-[var(--accent)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none"
							placeholder="Enter task title..."
							onKeyDown={(e) => {
								if (e.key === 'Enter' && e.target.value.trim()) {
									onAddTask({ title: e.target.value });
									setShowTaskAdder(false);
								}
								if (e.key === 'Escape') {
									setShowTaskAdder(false);
								}
							}}
							onBlur={() => setShowTaskAdder(false)}
						/>
						<p className="text-[10px] text-[var(--text-secondary)] mt-1 ml-1">
							Press Enter to add, Esc to cancel
						</p>
					</div>
				)}
			</div>

		</div>
	);
}