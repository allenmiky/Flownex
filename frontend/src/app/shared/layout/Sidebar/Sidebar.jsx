import { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import { useNavigate, useLocation } from "react-router-dom";
import { mainItems } from "./sidebarData";
import { AddBoard } from "../../../features/addboard";
import { Store } from "../../../data/store";
import { Icons } from "../../../../icons";

export default function Sidebar() {
	const navigate = useNavigate();
	const location = useLocation();

	const [collapsed, setCollapsed] = useState(() => {
		return localStorage.getItem("flownex_sidebar") === "collapsed";
	});

	const [menuOpen, setMenuOpen] = useState(() =>
		localStorage.getItem("flownex_menu") !== "closed"
	);
	const [boardsOpen, setBoardsOpen] = useState(true);
	const [showAddBoard, setShowAddBoard] = useState(false);
	const [boards, setBoards] = useState([]);

	/* Load boards */
	useEffect(() => {
		const loadBoards = () => setBoards(Store.getBoards());
		loadBoards();
		window.addEventListener("storage-update", loadBoards);
		return () =>
			window.removeEventListener("storage-update", loadBoards);
	}, []);

	useEffect(() => {
		localStorage.setItem(
			"flownex_menu",
			menuOpen ? "open" : "closed"
		);
	}, [menuOpen]);

	useEffect(() => {
		localStorage.setItem(
			"flownex_sidebar",
			collapsed ? "collapsed" : "expanded"
		);
	}, [collapsed]);


	const handleAddBoard = (newBoard) => {
		const boardId = Store.addBoard(newBoard.name);
		setShowAddBoard(false);
		navigate(`/board/${boardId}`);
	};

	return (
		<>
			<aside className={`fn-sidebar ${collapsed ? "collapsed" : ""}`}>

				{/* 🔹 TOP BAR (BURGER + LOGO/TITLE) */}
				<div className="fn-sidebar-top">
					<button
						className="fn-burger"
						onClick={() => setCollapsed(!collapsed)}
					>
						<Icons.Menu size={20} />
					</button>
					{!collapsed && <span className="fn-sidebar-logo">Flownex</span>}
				</div>

				{/* 🔹 MENU HEADER */}
				<div
					className="fn-sidebar-title fn-toggle"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					<span>Menu</span>
					<Icons.ChevronDown
						size={16}
						className={`chevron ${menuOpen ? "open" : ""}`}
					/>
				</div>

				{/* 🔹 MAIN ITEMS */}
				<div className={`fn-expand ${menuOpen ? "open" : ""}`}>
					{mainItems.map((item) => {
						const active = location.pathname === item.path;
						return (
							<div
								key={item.id}
								onClick={() => navigate(item.path)}
								className={`fn-sidebar-item ${active ? "active" : ""}`}
							>
								<SidebarItem item={item} collapsed={collapsed} />
							</div>
						);
					})}
				</div>

				{/* 🔹 BOARDS HEADER */}
				<div
					className="fn-sidebar-title fn-toggle"
					onClick={() => setBoardsOpen(!boardsOpen)}
				>
					<span>My Boards</span>
					<Icons.ChevronDown
						size={16}
						className={`chevron ${boardsOpen ? "open" : ""}`}
					/>
				</div>

				{/* 🔹 BOARDS LIST */}
				<div className={`fn-expand ${boardsOpen ? "open" : ""}`}>
					<button
						className="fn-sidebar-item fn-add-board flex items-center gap-2 m-3"
						onClick={() => setShowAddBoard(true)}
					>
						<Icons.Add size={16} />
						<span>Add Board</span>
					</button>

					<div className="fn-board-list">
						{boards.map((board) => {
							const active =
								location.pathname === `/board/${board.id}`;

							return (
								<div
									key={board.id}
									onClick={() => navigate(`/board/${board.id}`)}
									className={`fn-sidebar-item ${active ? "active" : ""}`}
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
							);
						})}
					</div>
				</div>

				{/* 🔹 BOTTOM SETTINGS */}
				<div className="fn-sidebar-bottom">
					<button
						className="fn-sidebar-item"
						onClick={() => navigate("/settings")}
					>
						<Icons.Settings size={18} />
						{!collapsed && <span>Settings</span>}
					</button>
				</div>
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
