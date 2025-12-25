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
					tasks: [],
				},
				{
					id: "inprogress",
					title: "In Progress",
					tasks: [],
				},
				{
					id: "review",
					title: "Review",
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

	// Add task with all details
	addTask(taskData) {
		const state = this.getState();

		const column = state.board.columns.find((c) => c.id === taskData.status || "todo");
		if (!column) return null;

		const newTask = {
			id: crypto.randomUUID(),
			title: taskData.title,
			description: taskData.description || "",
			dueDate: taskData.dueDate || "",
			priority: taskData.priority || "medium",
			tags: taskData.tags || [],
			subTasks: taskData.subTasks || [],
			assignee: taskData.assignee || "",
			status: taskData.status || "todo",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		column.tasks.push(newTask);
		write(state);

		// Dispatch storage update event
		window.dispatchEvent(new Event("storage-update"));

		return newTask;
	},

	// Update existing task
	updateTask(taskId, updates) {
		const state = this.getState();
		let taskFound = false;

		// Find task in any column
		for (const column of state.board.columns) {
			const taskIndex = column.tasks.findIndex(t => t.id === taskId);
			if (taskIndex !== -1) {
				// If status changed, move task to new column
				if (updates.status && updates.status !== column.id) {
					// Remove from current column
					const [task] = column.tasks.splice(taskIndex, 1);

					// Add to new column
					const newColumn = state.board.columns.find(c => c.id === updates.status);
					if (newColumn) {
						task.status = updates.status;
						Object.assign(task, updates);
						task.updatedAt = new Date().toISOString();
						newColumn.tasks.push(task);
					}
				} else {
					// Update in same column
					Object.assign(column.tasks[taskIndex], updates, {
						updatedAt: new Date().toISOString()
					});
				}
				taskFound = true;
				break;
			}
		}

		if (taskFound) {
			write(state);
			window.dispatchEvent(new Event("storage-update"));
			return true;
		}
		return false;
	},

	// Delete task
	deleteTask(taskId) {
		const state = this.getState();
		let deleted = false;

		for (const column of state.board.columns) {
			const initialLength = column.tasks.length;
			column.tasks = column.tasks.filter(t => t.id !== taskId);
			if (column.tasks.length < initialLength) {
				deleted = true;
				break;
			}
		}

		if (deleted) {
			write(state);
			window.dispatchEvent(new Event("storage-update"));
			return true;
		}
		return false;
	},

	// Move task between columns (for drag & drop)
	moveTask(taskId, sourceColumnId, destinationColumnId, destinationIndex) {
		const state = this.getState();

		const sourceColumn = state.board.columns.find(c => c.id === sourceColumnId);
		const destinationColumn = state.board.columns.find(c => c.id === destinationColumnId);

		if (!sourceColumn || !destinationColumn) return false;

		const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
		if (taskIndex === -1) return false;

		const [task] = sourceColumn.tasks.splice(taskIndex, 1);

		// Update task status
		task.status = destinationColumnId;
		task.updatedAt = new Date().toISOString();

		// Insert at specified index
		destinationColumn.tasks.splice(destinationIndex, 0, task);

		write(state);
		window.dispatchEvent(new Event("storage-update"));
		return true;
	},

	// Reorder tasks within same column
	reorderTasks(columnId, newTaskOrder) {
		const state = this.getState();
		const column = state.board.columns.find(c => c.id === columnId);

		if (!column) return false;

		// Update tasks array with new order
		column.tasks = newTaskOrder;

		write(state);
		window.dispatchEvent(new Event("storage-update"));
		return true;
	},

	// Add new column
	addColumn(title) {
		const state = this.getState();

		const newColumn = {
			id: `column-${crypto.randomUUID()}`,
			title: title || "New Column",
			tasks: []
		};

		state.board.columns.push(newColumn);
		write(state);
		window.dispatchEvent(new Event("storage-update"));
		return newColumn;
	},

	// Update column
	updateColumn(columnId, updates) {
		const state = this.getState();
		const column = state.board.columns.find(c => c.id === columnId);

		if (!column) return false;

		Object.assign(column, updates);
		write(state);
		window.dispatchEvent(new Event("storage-update"));
		return true;
	},

	// Delete column (moves tasks to todo column)
	deleteColumn(columnId) {
		const state = this.getState();
		const columnIndex = state.board.columns.findIndex(c => c.id === columnId);

		if (columnIndex === -1) return false;

		const column = state.board.columns[columnIndex];
		const todoColumn = state.board.columns.find(c => c.id === "todo");

		// Move all tasks to todo column
		if (todoColumn && column.tasks.length > 0) {
			column.tasks.forEach(task => {
				task.status = "todo";
				task.updatedAt = new Date().toISOString();
			});
			todoColumn.tasks.push(...column.tasks);
		}

		// Remove the column
		state.board.columns.splice(columnIndex, 1);

		write(state);
		window.dispatchEvent(new Event("storage-update"));
		return true;
	},

	// Get all tasks (for filtering/search)
	getAllTasks() {
		const state = this.getState();
		const allTasks = [];

		state.board.columns.forEach(column => {
			column.tasks.forEach(task => {
				allTasks.push({ ...task, columnId: column.id });
			});
		});

		return allTasks;
	},

	// Update entire board
	updateBoard(board) {
		const state = this.getState();
		state.board = board;
		write(state);
		window.dispatchEvent(new Event("storage-update"));
	},

	// Reset to initial state
	reset() {
		localStorage.removeItem(STORAGE_KEY);
		window.dispatchEvent(new Event("storage-update"));
	},

	// Export board data
	exportData() {
		return this.getState();
	},

	// Import board data
	importData(data) {
		if (!data || !data.board) return false;

		write(data);
		window.dispatchEvent(new Event("storage-update"));
		return true;
	}
};