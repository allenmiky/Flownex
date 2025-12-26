import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "./app/AppShell";
import Board from "./app/features/board/Board";

export default function App() {
	return (
		<Router>
			<AppShell>
				<Routes>
					{/* Default Dashboard */}
					<Route path="/" element={<Board boardId="default" />} />

					{/* Dynamic Board Route */}
					<Route path="/board/:id" element={<Board />} />
				</Routes>
			</AppShell>
		</Router>
	);
}