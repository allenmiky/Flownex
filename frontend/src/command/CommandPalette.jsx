import { useEffect, useState } from "react";
import { commands } from "./commands";
import CommandInput from "./CommandInput";
import CommandList from "./CommandList";

export default function CommandPalette({ actions }) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	useEffect(() => {
		function handleKey(e) {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setOpen((v) => !v);
			}
		}
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, []);

	if (!open) return null;

	const filtered = commands.filter((c) =>
		c.label.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-32">
			<div className="w-[420px] rounded-xl bg-zinc-900 shadow-xl">
				<CommandInput value={query} onChange={setQuery} />
				<CommandList
					items={filtered}
					onSelect={(cmd) => {
						cmd.action(actions);
						setOpen(false);
					}}
				/>
			</div>
		</div>
	);
}
