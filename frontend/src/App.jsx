import { useEffect, useState } from "react";
import AppShell from "./app/AppShell";
import Button from "./app/shared/ui/Button";
import Board from "./app/features/board/Board";
import { CommandPalette } from "./command";

export default function App() {
	const [theme, setTheme] = useState(
		localStorage.getItem("theme") || "light"
	);

	const [taskBarOpen, setTaskBarOpen] = useState(false);

	function toggleTheme() {
		setTheme((t) => (t === "light" ? "dark" : "light"));
	}

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<AppShell>
			<CommandPalette
				actions={{
					openTaskBar: () => setTaskBarOpen(true),
					toggleTheme,
					goToBoards: () =>
						console.warn("Router not added yet"),
				}}
			/>

			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold">
					Marketing Campaign
				</h2>

				<Button onClick={toggleTheme}>
					Toggle Theme
				</Button>
			</div>

			<Board taskBarOpen={taskBarOpen} />
		</AppShell>
	);
}
