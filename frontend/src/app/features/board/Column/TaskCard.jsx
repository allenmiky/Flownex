import { useState, useRef, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import TaskAdderForm from "../TaskAdder/TaskAdderForm";
import TaskCardOptions from "./TaskCardOptions";
import { MoreHorizontal, MessageCircle, Paperclip } from "lucide-react";

export default function TaskCard({ task, index }) {
	const [showModal, setShowModal] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const cardRef = useRef(null);

	/* 🛑 prevent unwanted open */
	const handleCardMouseDown = (e) => {
		if (e.target.closest("[data-ignore-card-click]")) return;
		if (showOptions) return;

		e.stopPropagation();
		setShowModal(true);
	};

	/* 3 dots */
	const handleOptionsClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowOptions((v) => !v);
	};

	/* option action */
	const handleOptionSelect = (option) => {
		setShowOptions(false);

		if (option === "edit" || option === "open") {
			setShowModal(true);
		}
	};

	/* 🌫️ global blur trigger */
	useEffect(() => {
		if (showOptions) {
			document.body.classList.add("task-options-open");
		} else {
			document.body.classList.remove("task-options-open");
		}

		return () =>
			document.body.classList.remove("task-options-open");
	}, [showOptions]);

	return (
		<>
			<Draggable draggableId={task.id.toString()} index={index}>
				{(provided) => (
					<div
						ref={(el) => {
							provided.innerRef(el);
							cardRef.current = el;
						}}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						onMouseDown={handleCardMouseDown}
						className={`
							task-card
							relative mb-2 p-3
							rounded-xl
							border border-white/10
							bg-[var(--card-bg)]
							shadow-md
							cursor-pointer
							transition-all
							${showOptions ? "z-50 ring-1 ring-[var(--accent)]" : ""}
						`}
					>
						{/* 3 DOTS */}
						<button
							data-ignore-card-click
							onClick={handleOptionsClick}
							className="
								absolute top-2 right-2
								p-1.5 rounded-md
								text-white/50
								hover:text-white
								hover:bg-white/10
								transition
							"
						>
							<MoreHorizontal size={16} />
						</button>

						{/* PRIORITY BAR */}
						{task.priority && (
							<div
								className={`h-1 rounded-full mb-2 ${
									task.priority === "high"
										? "bg-red-500"
										: task.priority === "medium"
										? "bg-yellow-400"
										: "bg-green-500"
								}`}
							/>
						)}

						{/* TITLE */}
						<p className="text-sm font-medium pr-6 text-white">
							{task.title}
						</p>

						{/* TAGS */}
						{task.tags?.length > 0 && (
							<div className="flex gap-1 mt-2 flex-wrap">
								{task.tags.slice(0, 3).map((t, i) => (
									<span
										key={i}
										className="text-[11px] px-2 py-0.5 rounded text-white"
										style={{ background: t.color }}
									>
										{t.name}
									</span>
								))}
							</div>
						)}

						{/* FOOTER */}
						<div className="mt-2 flex gap-4 text-xs text-white/60">
							<span className="flex items-center gap-1">
								<MessageCircle size={13} />
								{task.comments?.length || 0}
							</span>
							<span className="flex items-center gap-1">
								<Paperclip size={13} />
								{task.attachments?.length || 0}
							</span>
						</div>

						{/* OPTIONS */}
						{showOptions && cardRef.current && (
							<TaskCardOptions
								task={task}
								onClose={() => setShowOptions(false)}
								onSelect={handleOptionSelect}
							/>
						)}
					</div>
				)}
			</Draggable>

			{/* MODAL */}
			{showModal && (
				<TaskAdderForm
					mode="edit"
					task={task}
					onClose={() => setShowModal(false)}
				/>
			)}
		</>
	);
}
