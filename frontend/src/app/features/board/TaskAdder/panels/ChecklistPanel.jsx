import { useState } from "react";

export default function ChecklistPanel({ subTasks, setSubTasks }) {
	const [text, setText] = useState("");

	function addSubTask() {
		if (!text.trim()) return;

		setSubTasks((prev) => [
			...prev,
			{
				id: Date.now(),
				title: text,
				completed: false,
			},
		]);
		setText("");
	}

	function toggleTask(id) {
		setSubTasks((prev) =>
			prev.map((t) =>
				t.id === id ? { ...t, completed: !t.completed } : t
			)
		);
	}

	function removeTask(id) {
		setSubTasks((prev) => prev.filter((t) => t.id !== id));
	}

	return (
		<div className="space-y-2">
			{Array.isArray(subTasks) &&
				subTasks.map((task) => (
					<div
						key={task.id}
						className="flex items-center gap-2"
					>
						<input
							type="checkbox"
							checked={task.completed}
							onChange={() => toggleTask(task.id)}
						/>
						<span
							className={`text-sm ${task.completed ? "line-through opacity-60" : ""
								}`}
						>
							{task.title}
						</span>
						<button
							onClick={() => removeTask(task.id)}
							className="ml-auto text-xs opacity-60 hover:opacity-100"
						>
							✕
						</button>
					</div>
				))}

			<div className="flex gap-2 mt-2">
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Add subtask..."
					className="fn-input flex-1"
				/>
				<button onClick={addSubTask} className="fn-btn">
					Add
				</button>
			</div>
		</div>
	);
}
