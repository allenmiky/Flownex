import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icons } from "../../../../icons";
import LabelsPanel from "./panels/LabelsPanel";
import DatesPanel from "./panels/DatesPanel";
import MembersPanel from "./panels/MembersPanel";
import PriorityPanel from "./panels/PriorityPanel";
import { Store } from "../../../data/store";
import { Maximize2, Minimize2, Trash2 } from "lucide-react";

// ✅ MODIFIED: mode prop add kiya
export default function TaskAdderForm({
	onClose,
	defaultStatus = "todo",
	mode = "create", // ✅ NEW: "create" ya "edit"
	task = null // ✅ NEW: Edit ke liye task data
}) {
	const { id: boardId } = useParams();

	// ✅ MODIFIED: useState with initial values based on mode
	const [title, setTitle] = useState(mode === "edit" && task ? task.title : "");
	const [description, setDescription] = useState(mode === "edit" && task ? task.description : "");
	const [tags, setTags] = useState(mode === "edit" && task ? task.tags || [] : []);
	const [subTasks, setSubTasks] = useState(mode === "edit" && task ? task.subTasks || [] : []);
	const [assignee, setAssignee] = useState(mode === "edit" && task ? task.assignee || "" : "");
	const [dueDate, setDueDate] = useState(mode === "edit" && task ? task.dueDate || "" : "");
	const [priority, setPriority] = useState(mode === "edit" && task ? task.priority || "medium" : "medium");
	const [status, setStatus] = useState(mode === "edit" && task ? task.status : defaultStatus); // ✅ NEW: status state

	// Existing states
	const [activePanel, setActivePanel] = useState(null);
	const [showChecklist, setShowChecklist] = useState(false);
	const [isDescExpanded, setIsDescExpanded] = useState(true);
	const [isChecklistExpanded, setIsChecklistExpanded] = useState(true);
	const [isFullScreen, setIsFullScreen] = useState(false);

	const panelRef = useRef(null);
	const checklistInputRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (panelRef.current && !panelRef.current.contains(e.target)) {
				setActivePanel(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleChecklistToggle = () => {
		setShowChecklist(true);
		setIsChecklistExpanded(true);
		setActivePanel(null);
		setTimeout(() => { checklistInputRef.current?.focus(); }, 100);
	};

	// ✅ MODIFIED: Single handleSubmit function for both create and edit
	const handleSubmit = () => {
		if (!title.trim()) return;

		const taskData = {
			title,
			description,
			tags,
			subTasks,
			assignee,
			dueDate,
			priority,
			status, // ✅ Use the status state
			updatedAt: new Date().toISOString(),
		};

		if (mode === "edit" && task) {
			// Edit existing task
			Store.updateTask(task.id, taskData);
		} else {
			// Create new task
			Store.addTask(boardId, {
				...taskData,
				createdAt: new Date().toISOString(),
			});
		}

		onClose();
	};

	// ✅ NEW: Add subtask function
	const handleAddSubTask = (text) => {
		if (text.trim()) {
			setSubTasks([...subTasks, { text, completed: false }]);
		}
	};

	// ✅ NEW: Toggle subtask completion
	const handleToggleSubTask = (index) => {
		const newSubTasks = [...subTasks];
		newSubTasks[index].completed = !newSubTasks[index].completed;
		setSubTasks(newSubTasks);
	};

	return (
		<>
			<div className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm" onClick={onClose} />

			<div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-primary)] border-2 border-[var(--accent)] rounded-xl shadow-2xl z-[70] flex flex-col overflow-hidden transition-all duration-300 
                ${isFullScreen ? 'w-screen h-screen rounded-none border-0' : 'w-[95%] max-w-[750px] max-h-[90vh]'}`}>

				{/* ✅ MODIFIED: Header with status selector */}
				<div className="p-6 pb-2 flex justify-between items-start">
					<div className="flex-1">
						<input
							autoFocus={mode === "create"}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Task Title..."
							className="w-full bg-transparent text-2xl font-bold outline-none text-[var(--text-primary)]"
						/>
						<div className="flex items-center gap-3 mt-1">
							<p className="text-sm text-[var(--text-secondary)]">in list</p>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="bg-transparent border rounded px-2 py-1 text-sm text-[var(--text-primary)]"
							>
								<option value="todo">To Do</option>
								<option value="inprogress">In Progress</option>
								<option value="review">Review</option>
								<option value="done">Done</option>
							</select>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{/* ✅ NEW: Delete button for edit mode */}
						{mode === "edit" && (
							<button
								onClick={() => {
									if (window.confirm("Are you sure you want to delete this task?")) {
										// Delete function agar banai hai toh use karein
										// Ya phir bas close karein
										onClose();
									}
								}}
								className="p-2 hover:bg-red-500/10 rounded-full text-red-500 transition-colors"
								title="Delete Task"
							>
								<Trash2 size={20} />
							</button>
						)}

						<button
							onClick={() => setIsFullScreen(!isFullScreen)}
							className="p-2 hover:bg-[var(--bg-hover)] rounded-full text-[var(--text-secondary)] transition-colors"
							title={isFullScreen ? "Collapse" : "Full Screen"}
						>
							{isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
						</button>

						<button onClick={onClose} className="p-2 hover:bg-[var(--bg-hover)] rounded-full text-[var(--text-secondary)]">
							<Icons.Close size={20} />
						</button>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
					<div className="flex flex-col md:flex-row gap-8 items-start relative">

						{/* Left Side */}
						<div className="flex-[3] w-full space-y-8">

							{/* Labels & Members Section */}
							<div className="flex flex-wrap gap-8">
								{tags.length > 0 && (
									<div>
										<h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-2">Labels</h4>
										<div className="flex gap-2 flex-wrap">
											{tags.map((t, idx) => (
												<span key={t.id || idx} className="h-8 px-3 rounded flex items-center text-white text-xs font-bold" style={{ background: t.color }}>
													{t.name}
												</span>
											))}
										</div>
									</div>
								)}

								{assignee && (
									<div>
										<h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-2">Members</h4>
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
												{assignee.charAt(0).toUpperCase()}
											</div>
											<span className="text-sm font-medium text-[var(--text-primary)]">{assignee}</span>
										</div>
									</div>
								)}
							</div>

							{/* Description Section */}
							<div className="space-y-3">
								<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsDescExpanded(!isDescExpanded)}>
									<div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">
										<Icons.Description size={18} className="text-[var(--accent)]" /> Description
									</div>
									<div className={`transition-transform ${isDescExpanded ? 'rotate-180' : ''}`}>
										{Icons.ChevronDown ? <Icons.ChevronDown size={18} /> : <span>▼</span>}
									</div>
								</div>
								{isDescExpanded && (
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Add description..."
										className={`w-full bg-[var(--bg-secondary)] border-2 border-[var(--accent)]/20 focus:border-[var(--accent)] rounded-lg p-3 text-sm outline-none transition-all ${isFullScreen ? 'min-h-[250px]' : 'min-h-[100px]'}`}
									/>
								)}
							</div>

							{/* ✅ MODIFIED: Checklist Section with proper handling */}
							{(subTasks.length > 0 || showChecklist) && (
								<div className="space-y-4">
									<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}>
										<div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">
											<Icons.Checklist size={18} className="text-[var(--accent)]" /> Checklist
										</div>
										<div className={`transition-transform ${isChecklistExpanded ? 'rotate-180' : ''}`}>
											{Icons.ChevronDown ? <Icons.ChevronDown size={18} /> : <span>▼</span>}
										</div>
									</div>
									{isChecklistExpanded && (
										<div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent)] rounded-xl p-4">
											{subTasks.map((st, i) => (
												<div key={`st-${i}`} className="flex items-center gap-3 mb-2">
													<input
														type="checkbox"
														checked={st.completed || false}
														onChange={() => handleToggleSubTask(i)}
														className="accent-[var(--accent)]"
													/>
													<span className={`text-sm ${st.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
														{st.text || st}
													</span>
												</div>
											))}
											<input
												ref={checklistInputRef}
												className="w-full bg-transparent border-b border-[var(--accent)]/20 py-1 text-sm outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
												placeholder="Add item..."
												onKeyDown={(e) => {
													if (e.key === 'Enter' && e.target.value.trim()) {
														handleAddSubTask(e.target.value);
														e.target.value = "";
													}
												}}
											/>
										</div>
									)}
								</div>
							)}
						</div>

						{/* Right Side Sidebar */}
						<div className="flex-1 w-full md:max-w-[180px] space-y-2 relative" ref={panelRef}>
							<h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">Actions</h4>
							<SidebarButton icon={<Icons.Member />} label="Members" onClick={() => setActivePanel("members")} />
							<SidebarButton icon={<Icons.Label />} label="Labels" onClick={() => setActivePanel("labels")} />
							<SidebarButton icon={<Icons.Checklist />} label="Checklist" onClick={handleChecklistToggle} />
							<SidebarButton icon={<Icons.Date />} label="Dates" onClick={() => setActivePanel("dates")} />
							<SidebarButton icon={<Icons.Priority />} label="Priority" onClick={() => setActivePanel("priority")} />

							{activePanel && (
								<div className="absolute top-0 right-0 w-[260px] z-[80] bg-[var(--bg-primary)] border-2 border-[var(--accent)] rounded-xl p-4 shadow-2xl">
									<div className="flex justify-between items-center mb-3 border-b pb-2">
										<span className="text-[10px] font-bold uppercase">{activePanel}</span>
										<button onClick={() => setActivePanel(null)}><Icons.Close size={14} /></button>
									</div>
									{activePanel === "labels" && <LabelsPanel tags={tags} setTags={setTags} />}
									{activePanel === "dates" && <DatesPanel dueDate={dueDate} setDueDate={setDueDate} />}
									{activePanel === "members" && <MembersPanel assignee={assignee} setAssignee={setAssignee} />}
									{activePanel === "priority" && <PriorityPanel priority={priority} setPriority={setPriority} />}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* ✅ MODIFIED: Footer with different button text */}
				<div className="p-6 border-t flex justify-between items-center bg-[var(--bg-primary)]">
					<div className="text-xs text-[var(--text-secondary)]">
						{mode === "edit" && task && (
							<>Task ID: {task.id}</>
						)}
					</div>
					<div className="flex gap-3">
						<button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							disabled={!title.trim()}
							className="px-8 py-2 bg-[var(--accent)] text-white rounded-lg font-bold disabled:opacity-50 hover:brightness-110 transition-all"
						>
							{mode === "edit" ? "Save Changes" : "Add Card"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function SidebarButton({ icon, label, onClick }) {
	return (
		<button onClick={onClick} className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-lg text-sm font-semibold w-full transition-all text-[var(--text-primary)]">
			<span className="text-[var(--text-secondary)]">{icon}</span>
			{label}
		</button>
	);
}