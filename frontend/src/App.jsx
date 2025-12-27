import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppShell from "./app/AppShell";
import Board from "./app/features/board/Board";

export default function App() {
	const [boards, setBoards] = useState([
		{ id: "default", name: "Main Board" }
	]);

	return (
		<Router>
			<AppShell boards={boards} setBoards={setBoards}>
				<Routes>
					<Route
						path="/"
						element={<Board boards={boards} boardId="default" />}
					/>
					<Route
						path="/board/:id"
						element={<Board boards={boards} />}
					/>
				</Routes>
			</AppShell>
		</Router>
	);
}
