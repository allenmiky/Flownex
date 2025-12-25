import { useState } from "react";

export default function SubtasksManager({ subTasks, setSubTasks }) {
	const [currentSubTask, setCurrentSubTask] = useState("");

	const handleAddSubTask = () => {
		if (currentSubTask.trim()) {
			setSubTasks([...subTasks, {
				id: Date.now(),
				title: currentSubTask.trim(),
				completed: false
			}]);
			setCurrentSubTask("");
		}
	};

	function removeSubTask(id) {
		setSubTasks(subTasks.filter(task => task.id !== id));
	}

	function toggleSubTask(id) {
		setSubTasks(subTasks.map(task =>
			task.id === id ? { ...task, completed: !task.completed } : task
		));
	}

	return (
		<div>
			<label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
				Subtasks
			</label>
			<div className="flex gap-2 mb-2">
				<input
					className="fn-input text-sm flex-1"
					placeholder="Add a subtask..."
					value={currentSubTask}
					onChange={(e) => setCurrentSubTask(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleAddSubTask()}
				/>
				<button
					onClick={handleAddSubTask}
					className="fn-btn-secondary text-sm px-2 py-1"
				>
					+
				</button>
			</div>
			<div className="space-y-1 max-h-28 overflow-y-auto">
				{subTasks.map((subTask) => (
					<div key={subTask.id} className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={subTask.completed}
							onChange={() => toggleSubTask(subTask.id)}
							className="w-3 h-3 rounded border-[var(--border-color)]"
						/>
						<span className={`text-xs flex-1 ${subTask.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
							{subTask.title}
						</span>
						<button
							onClick={() => removeSubTask(subTask.id)}
							className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
						>
							✕
						</button>
					</div>
				))}
			</div>
		</div>
	);
}