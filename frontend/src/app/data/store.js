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

function emit() {
	window.dispatchEvent(new Event("storage-update"));
}

/* ------------------ INIT ------------------ */
function createBoard(id, title) {
	return {
		id,
		title,
		columns: [
			{ id: "todo", title: "To Do", tasks: [] },
			{ id: "inprogress", title: "In Progress", tasks: [] },
			{ id: "review", title: "Review", tasks: [] },
			{ id: "done", title: "Done", tasks: [] },
		],
	};
}

function createInitialState() {
	return {
		boards: [
			createBoard("default", "Main Board"),
		],
	};
}

/* ------------------ HELPERS ------------------ */
function getStateSafe() {
	const data = read();
	if (data?.boards) return data;

	const fresh = createInitialState();
	write(fresh);
	return fresh;
}

function getBoard(state, boardId = "default") {
	return state.boards.find(b => b.id === boardId);
}

/* ------------------ PUBLIC API ------------------ */
export const Store = {

	/* ---------- STATE ---------- */
	getState() {
		return getStateSafe();
	},

	/* ---------- BOARDS ---------- */
	getBoards() {
		return getStateSafe().boards;
	},

	getBoardById(boardId = "default") {
		const state = getStateSafe();
		return getBoard(state, boardId);
	},

	addBoard(title) {
		const state = getStateSafe();
		const id = Date.now().toString();

		state.boards.push(createBoard(id, title));
		write(state);
		emit();

		return id;
	},

	/* ---------- TASKS ---------- */
	addTask(boardId, task) {
		const state = getStateSafe();
		const board = getBoard(state, boardId);
		if (!board) return;

		const column = board.columns.find(
			c => c.id === (task.status || "todo")
		);
		if (!column) return;

		column.tasks.push({
			id: crypto.randomUUID(),
			title: task.title,
			status: column.id,
		});

		write(state);
		emit();
	},

	moveTask(taskId, fromCol, toCol, index, boardId) {
		const state = getStateSafe();
		const board = getBoard(state, boardId);
		if (!board) return;

		const source = board.columns.find(c => c.id === fromCol);
		const target = board.columns.find(c => c.id === toCol);
		if (!source || !target) return;

		const taskIndex = source.tasks.findIndex(t => t.id === taskId);
		if (taskIndex === -1) return;

		const [task] = source.tasks.splice(taskIndex, 1);
		task.status = toCol;

		target.tasks.splice(index, 0, task);

		write(state);
		emit();
	},

	reorderTasks(colId, tasks, boardId) {
		const state = getStateSafe();
		const board = getBoard(state, boardId);
		if (!board) return;

		const column = board.columns.find(c => c.id === colId);
		if (!column) return;

		column.tasks = tasks;

		write(state);
		emit();
	},

	/* ---------- COLUMNS ---------- */
	addColumn(boardId, title) {
		const state = getStateSafe();
		const board = getBoard(state, boardId);
		if (!board) return;

		board.columns.push({
			id: crypto.randomUUID(),
			title,
			tasks: [],
		});

		write(state);
		emit();
	},
};
