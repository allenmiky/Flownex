import { icons } from "./sidebarIcons";

export default function SidebarToggle({ collapsed, onToggle }) {
	const Icon = collapsed ? icons.expand : icons.collapse;

	return (
		<button className="fn-sidebar-toggle" onClick={onToggle}>
			<Icon size={18} />
		</button>
	);
}
