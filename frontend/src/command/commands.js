export const commands = [
	{
		id: "add-task",
		label: "Add Task",
		action: ({ openTaskBar }) => openTaskBar(),
	},
	{
		id: "toggle-theme",
		label: "Toggle Theme",
		action: ({ toggleTheme }) => toggleTheme(),
	},
	{
		id: "switch-board",
		label: "Switch Board",
		action: ({ goToBoards }) => goToBoards(),
	},
];
