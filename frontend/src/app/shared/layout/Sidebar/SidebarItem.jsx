import { icons } from "./sidebarIcons";

export default function SidebarItem({ item, collapsed }) {
	const Icon = icons[item.icon];

	return (
		<div
			className="fn-sidebar-item"
			title={collapsed ? item.label : undefined}
		>
			<Icon size={18} />
			{!collapsed && <span>{item.label}</span>}
		</div>
	);
}
