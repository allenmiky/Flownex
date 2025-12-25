const STORAGE_KEY = "flownex_app";

/* ------------------ INTERNAL ------------------ */
function read() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

function write(data) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ------------------ INIT ------------------ */
function createInitialState() {
	return {
		board: {
			id: "default",
			title: "Marketing Campaign",
			columns: [
				{
					id: "todo",
					title: "To Do",
					tasks: [
						{ id: "1", title: "Create landing page" },
					],
				},
				{
					id: "progress",
					title: "In Progress",
					tasks: [],
				},
				{
					id: "done",
					title: "Done",
					tasks: [],
				},
			],
		},
	};
}

/* ------------------ PUBLIC API ------------------ */
export const Store = {
	getState() {
		const data = read();
		if (data) return data;

		const fresh = createInitialState();
		write(fresh);
		return fresh;
	},

	getBoard() {
		return this.getState().board;
	},

	// Add task to specific column
	addTask(columnId, title) {
		const state = this.getState();

		const column = state.board.columns.find((c) => c.id === columnId);
		if (!column) return;

		const newTask = {
			id: crypto.randomUUID(),
			title,
		};

		// Add new task to the column
		column.tasks.push(newTask);

		// Update the localStorage with new task added
		write(state);
		return state.board;
	},

	updateBoard(board) {
		const state = this.getState();
		state.board = board;
		write(state);
	},

	reset() {
		localStorage.removeItem(STORAGE_KEY);
	},
};
