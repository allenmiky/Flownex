import { useState } from "react";
import AppShell from "./app/AppShell";
import Board from "./app/features/board/Board";

export default function App() {
	const [taskBarOpen, setTaskBarOpen] = useState(false);

	return (
		<AppShell>
			<Board taskBarOpen={taskBarOpen} />
		</AppShell>
	);
}
