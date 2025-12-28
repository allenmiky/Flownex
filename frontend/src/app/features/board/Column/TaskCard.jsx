import { useState, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import TaskAdderForm from "../TaskAdder/TaskAdderForm";

export default function TaskCard({ task, index, onTaskClick }) {
	const [showModal, setShowModal] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	// ✅ Detect if dragging
	useEffect(() => {
		const handleDragStart = () => setIsDragging(true);
		const handleDragEnd = () => setIsDragging(false);

		document.addEventListener('dragstart', handleDragStart);
		document.addEventListener('dragend', handleDragEnd);

		return () => {
			document.removeEventListener('dragstart', handleDragStart);
			document.removeEventListener('dragend', handleDragEnd);
		};
	}, []);

	// ✅ Click handler - FIXED for draggable conflict
	const handleClick = (e) => {
		// Agar dragging ho raha hai toh click ignore karein
		if (isDragging) {
			console.log("Ignoring click during drag");
			return;
		}

		// IMPORTANT: Stop propagation
		e.stopPropagation();
		
		console.log("🖱️ TaskCard clicked");

		// Agar prop available hai toh use karein
		if (onTaskClick && typeof onTaskClick === 'function') {
			console.log("📞 Calling onTaskClick prop");
			onTaskClick(task);
		} else {
			console.log("🚀 Opening modal directly");
			setShowModal(true);
		}
	};

	// ✅ Handle mouse down for better drag detection
	const handleMouseDown = (e) => {
		// Agar right-click ya middle-click hai toh ignore karein
		if (e.button !== 0) return;
		
		// Thoda delay dekar check karein ki drag ho raha hai ya click
		setTimeout(() => {
			if (!isDragging) {
				// Normal click hai
			}
		}, 150);
	};

	return (
		<>
			<Draggable draggableId={task.id.toString()} index={index}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className={`rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--card-bg)] p-3 mb-2 shadow-[var(--shadow-sm)] hover:shadow-md transition-all ${
							snapshot.isDragging 
								? 'opacity-80 rotate-1 scale-105 cursor-grabbing' 
								: 'cursor-grab'
						}`}
						onClick={handleClick}
						onMouseDown={handleMouseDown}
						// ✅ Remove inline style - yeh conflict kar sakta hai
					>
						{/* Priority indicator */}
						{task.priority === 'high' && (
							<div className="w-full h-1 bg-red-500 rounded-t mb-2"></div>
						)}
						{task.priority === 'medium' && (
							<div className="w-full h-1 bg-yellow-500 rounded-t mb-2"></div>
						)}
						{task.priority === 'low' && (
							<div className="w-full h-1 bg-green-500 rounded-t mb-2"></div>
						)}

						{/* Title */}
						<p className="text-sm font-medium text-[var(--text-primary)] mb-2">
							{task.title}
						</p>

						{/* Description preview */}
						{task.description && (
							<p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
								{task.description}
							</p>
						)}

						{/* Tags */}
						{task.tags && task.tags.length > 0 && (
							<div className="flex flex-wrap gap-1 mb-2">
								{task.tags.slice(0, 2).map((tag, tagIndex) => (
									<span
										key={tag.id || `tag-${tagIndex}`}
										className="px-2 py-0.5 rounded text-xs text-white"
										style={{ background: tag.color }}
									>
										{tag.name}
									</span>
								))}

								{task.tags.length > 2 && (
									<span className="px-2 py-0.5 rounded text-xs bg-[var(--bg-muted)] text-[var(--text-secondary)]">
										+{task.tags.length - 2}
									</span>
								)}
							</div>
						)}

						{/* Subtasks progress */}
						{task.subTasks && task.subTasks.length > 0 && (
							<div className="mb-2">
								<div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
									<span>Subtasks</span>
									<span>
										{task.subTasks.filter(st => st.completed).length}/{task.subTasks.length}
									</span>
								</div>
								<div className="w-full bg-[var(--bg-muted)] rounded-full h-1.5">
									<div
										className="bg-[var(--accent)] h-1.5 rounded-full"
										style={{
											width: `${(task.subTasks.filter(st => st.completed).length / task.subTasks.length) * 100}%`
										}}
									></div>
								</div>
							</div>
						)}

						{/* Footer with metadata */}
						<div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
							<div className="flex items-center gap-2">
								{/* Due date */}
								{task.dueDate && (
									<div className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
										<span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
									</div>
								)}

								{/* Icons placeholders */}
								<div className="flex items-center gap-3">
									<span className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
										</svg>
										<span>{task.comments ? task.comments.length : 0}</span>
									</span>
									<span className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
										</svg>
										<span>{task.attachments ? task.attachments.length : 0}</span>
									</span>
								</div>
							</div>

							{/* Assignee avatar */}
							{task.assignee && (
								<div className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs">
									{task.assignee.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					</div>
				)}
			</Draggable>

			{/* ✅ Modal - Yeh same rahega */}
			{showModal && (
				<TaskAdderForm
					onClose={() => setShowModal(false)}
					mode="edit"
					task={task}
					defaultStatus={task.status || "todo"}
				/>
			)}
		</>
	);
}