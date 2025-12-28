import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppShell from "./app/AppShell";
import Board from "./app/features/board/Board";
import { Store } from "./app/data/store";

export default function App() {
	const [boards, setBoards] = useState([]);

	useEffect(() => {
		const loadBoards = () => {
			const allBoards = Store.getBoards();
			setBoards(allBoards);
		};

		loadBoards();
		window.addEventListener("storage-update", loadBoards);
		return () => window.removeEventListener("storage-update", loadBoards);
	}, []);

	return (
		<Router>
			<AppShell boards={boards} setBoards={setBoards}>
				<Routes>
					{/* Home page - Board component empty state dikhayega */}
					<Route
						path="/"
						element={<Board />}
					/>

					{/* Board route */}
					<Route
						path="/board/:id"
						element={<Board />}
					/>
				</Routes>
			</AppShell>
		</Router>
	);
}