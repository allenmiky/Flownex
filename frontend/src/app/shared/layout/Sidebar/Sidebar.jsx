import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import SidebarToggle from "./SidebarToggle";
import { mainItems, settingsItems } from "./sidebarData";
import { icons } from "./sidebarIcons";
import { AddBoard } from "../../../features/addboard";

export default function Sidebar() {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const [showAddBoard, setShowAddBoard] = useState(false);

	const [userBoards, setUserBoards] = useState([
		{ id: "default", label: "Main Board", icon: "projects" }
	]);

	const handleAddBoard = (newBoard) => {
		const id = Date.now().toString();
		const boardItem = {
			id: id,
			label: newBoard.name,
			icon: "projects",
			image: newBoard.image ? URL.createObjectURL(newBoard.image) : null
		};
		setUserBoards([...userBoards, boardItem]);

		// Naya board bante hi wahan navigate karein
		navigate(`/board/${id}`);
	};

	return (
		<>
			<aside className={`fn-sidebar ${collapsed ? "collapsed" : ""}`}>
				<div className="fn-sidebar-section">
					{mainItems.map((item) => (
						<SidebarItem key={item.id} item={item} collapsed={collapsed} />
					))}
				</div>

				<div className="fn-sidebar-section">
					{!collapsed && <div className="fn-sidebar-title">My Boards</div>}

					{userBoards.map((board) => (
						<div key={board.id} onClick={() => navigate(`/board/${board.id}`)} className="cursor-pointer">
							<SidebarItem item={board} collapsed={collapsed} />
						</div>
					))}

					<button className="fn-sidebar-item fn-add-board" onClick={() => setShowAddBoard(true)}>
						<span>+ Add Board</span>
					</button>
				</div>
				{/* ... Toggle code */}
			</aside>

			{showAddBoard && (
				<AddBoard onClose={() => setShowAddBoard(false)} onSubmit={handleAddBoard} />
			)}
		</>
	);
}