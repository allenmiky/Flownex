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
	/* ---------- MERGED addTask ---------- */
	addTask(boardId, taskData) {
		const state = this.getState(); // getStateSafe() ki jagah this.getState() use karein

		// 1. Sahi board dhoondein
		const board = state.boards.find(b => b.id === boardId) || state.boards.find(b => b.id === state.activeBoardId);
		if (!board) return null;

		// 2. Sahi column dhoondein
		const columnId = taskData.status || "todo";
		const column = board.columns.find(c => c.id === columnId);
		if (!column) return null;

		// 3. Merged Task Object (Saare fields ke saath)
		const newTask = {
			id: crypto.randomUUID(),
			title: taskData.title || "Untitled Task",
			description: taskData.description || "",
			status: columnId,
			// Image UI ke extra fields
			members: taskData.members || [],
			labels: taskData.labels || [],
			checklist: taskData.checklist || [],
			dueDate: taskData.dueDate || "",
			priority: taskData.priority || "none",
			// Metadata
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// 4. Save and Emit
		column.tasks.push(newTask);
		write(state);

		// emit() function agar defined hai toh wo use karein, warna standard event:
		window.dispatchEvent(new Event("storage-update"));

		return newTask;
	},

	getTaskById(taskId) {
		const state = this.getState();
		for (const board of state.boards) {
			for (const column of board.columns) {
				const task = column.tasks.find(t => t.id === taskId);
				if (task) return task;
			}
		}
		return null;
	},

	updateTask(taskId, updates) {
		const state = this.getState();
		let taskFound = false;

		for (const board of state.boards) {
			for (const column of board.columns) {
				const index = column.tasks.findIndex(t => t.id === taskId);
				if (index !== -1) {
					const task = column.tasks[index];

					// Agar status change ho raha hai toh column badalna hoga
					if (updates.status && updates.status !== column.id) {
						column.tasks.splice(index, 1);
						const targetCol = board.columns.find(c => c.id === updates.status);
						if (targetCol) {
							Object.assign(task, updates);
							targetCol.tasks.push(task);
						}
					} else {
						// Sirf details update karein
						Object.assign(task, updates);
					}

					task.updatedAt = new Date().toISOString();
					taskFound = true;
					break;
				}
			}
			if (taskFound) break;
		}

		if (taskFound) {
			write(state);
			window.dispatchEvent(new Event("storage-update"));
			return true;
		}
		return false;
	},

	// store.js mein ye function add karein:

	deleteTask(taskId) {
		const state = this.getState();
		let taskFound = false;

		for (const board of state.boards) {
			for (const column of board.columns) {
				const index = column.tasks.findIndex(t => t.id === taskId);
				if (index !== -1) {
					column.tasks.splice(index, 1);
					taskFound = true;
					break;
				}
			}
			if (taskFound) break;
		}

		if (taskFound) {
			write(state);
			window.dispatchEvent(new Event("storage-update"));
			return true;
		}
		return false;
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