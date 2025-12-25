import { useState } from "react";

export default function TaskInput({ onSubmit }) {
	const [title, setTitle] = useState("");

	function handleKey(e) {
		if (e.key === "Enter" && title.trim()) {
			onSubmit(title);
			setTitle("");
		}
	}

	return (
		<input
			value={title}
			onChange={(e) => setTitle(e.target.value)}
			onKeyDown={handleKey}
			placeholder="Add a new task..."
			className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white outline-none"
		/>
	);
}
