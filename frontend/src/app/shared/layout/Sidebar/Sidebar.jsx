import { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import SidebarToggle from "./SidebarToggle";
import { mainItems } from "./sidebarData";
import { AddBoard } from "../../../features/addboard";
import { Store } from "../../../data/store";

export default function Sidebar() {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const [showAddBoard, setShowAddBoard] = useState(false);
	const [boards, setBoards] = useState([]);

	// 🔹 Load boards from Store
	useEffect(() => {
		const loadBoards = () => {
			setBoards(Store.getBoards());
		};

		loadBoards();
		window.addEventListener("storage-update", loadBoards);
		return () =>
			window.removeEventListener("storage-update", loadBoards);
	}, []);

	// 🔹 Add board via Store
	const handleAddBoard = (newBoard) => {
		const board = Store.addBoard(newBoard.name);
		setShowAddBoard(false);
		navigate(`/board/${board.id}`);
	};

	return (
		<>
			<aside className={`fn-sidebar ${collapsed ? "collapsed" : ""}`}>
				{/* Main items */}
				<div className="fn-sidebar-section">
					{mainItems.map((item) => (
						<SidebarItem
							key={item.id}
							item={item}
							collapsed={collapsed}
						/>
					))}
				</div>

				{/* Boards */}
				<div className="fn-sidebar-section">
					{!collapsed && (
						<div className="fn-sidebar-title">
							My Boards
						</div>
					)}

					{boards.map((board) => (
						<div
							key={board.id}
							onClick={() =>
								navigate(`/board/${board.id}`)
							}
							className="cursor-pointer"
						>
							<SidebarItem
								item={{
									id: board.id,
									label: board.title,
									icon: "projects"
								}}
								collapsed={collapsed}
							/>
						</div>
					))}

					<button
						className="fn-sidebar-item fn-add-board"
						onClick={() => setShowAddBoard(true)}
					>
						<span>+ Add Board</span>
					</button>
				</div>

				<SidebarToggle
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>
			</aside>

			{showAddBoard && (
				<AddBoard
					onClose={() => setShowAddBoard(false)}
					onSubmit={handleAddBoard}
				/>
			)}
		</>
	);
}
