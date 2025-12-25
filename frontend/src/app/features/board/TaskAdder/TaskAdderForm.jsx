import { useState } from "react";
import { Store } from "../../../data/store";

export default function TaskAdderForm({ onClose }) {
	const [title, setTitle] = useState("");

	function addTask() {
		if (!title.trim()) return;

		Store.addTask({
			title,
			status: "todo",
		});

		window.dispatchEvent(new Event("storage-update"));
		onClose();
	}

	return (
		<>
			{/* Overlay */}
			<div className="fn-overlay" onClick={onClose} />

			{/* Modal */}
			<div className="fn-modal fn-card">
				<h3 className="fn-modal-title">Add Task</h3>

				<input
					autoFocus
					className="fn-input"
					placeholder="Task title..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && addTask()}
				/>

				<div className="fn-actions">
					<button className="fn-btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button className="fn-btn" onClick={addTask}>
						Add
					</button>
				</div>
			</div>
		</>
	);
}
