import { useState } from "react";
import SidebarItem from "./SidebarItem";
import SidebarToggle from "./SidebarToggle";
import { mainItems, settingsItems } from "./sidebarData";
import { icons } from "./sidebarIcons";
import { AddBoard } from "../../../features/addboard";

export default function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const [showAddBoard, setShowAddBoard] = useState(false);

	const AddIcon = icons.add;

	return (
		<>
			<aside className={`fn-sidebar ${collapsed ? "collapsed" : ""}`}>

				{/* Main Navigation */}
				<div className="fn-sidebar-section">
					{mainItems.map((item) => (
						<SidebarItem
							key={item.id}
							item={item}
							collapsed={collapsed}
						/>
					))}
				</div>

				{/* Add Board */}
				<button
					className="fn-sidebar-item fn-add-board"
					title="Add Board"
					onClick={() => setShowAddBoard(true)}
				>
					<AddIcon size={18} />
					{!collapsed && <span>Add Board</span>}
				</button>

				<div className="fn-sidebar-spacer" />

				{/* Settings */}
				<div className="fn-sidebar-section">
					{!collapsed && (
						<div className="fn-sidebar-title">Settings</div>
					)}

					{settingsItems.map((item) => (
						<SidebarItem
							key={item.id}
							item={item}
							collapsed={collapsed}
						/>
					))}
				</div>

				{/* Collapse Toggle */}
				<SidebarToggle
					collapsed={collapsed}
					onToggle={() => setCollapsed((v) => !v)}
				/>
			</aside>

			{/* Add Board Modal */}
			{showAddBoard && (
				<AddBoard
					onClose={() => setShowAddBoard(false)}
					onSubmit={(board) => {
						console.log("New board:", board);
						// baad me Store.addBoard(board)
					}}
				/>
			)}
		</>
	);
}
