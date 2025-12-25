import { useState } from "react";
import { TaskAdder } from "../TaskAdder";

export default function TaskBar() {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Bottom centered task bar */}
			<div className="fn-taskbar fn-card fn-flex fn-gap-md">
				<button
					className="fn-btn"
					onClick={() => setOpen(true)}
				>
					Add Task
				</button>
			</div>

			{/* Task Adder (Trello-style) */}
			{open && (
				<TaskAdder onClose={() => setOpen(false)} />
			)}
		</>
	);
}
