import { useState, useRef, useEffect } from "react";
import { Icons } from "../../../../icons";
import LabelsPanel from "./panels/LabelsPanel";
import DatesPanel from "./panels/DatesPanel";
import MembersPanel from "./panels/MembersPanel";
import PriorityPanel from "./panels/PriorityPanel";
import { Store } from "../../../data/store";

export default function TaskAdderForm({ onClose, defaultStatus = "todo" }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState([]);
	const [subTasks, setSubTasks] = useState([]);
	const [assignee, setAssignee] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [priority, setPriority] = useState("medium");

	const [activePanel, setActivePanel] = useState(null);
	const [showChecklist, setShowChecklist] = useState(false);

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
		setActivePanel(null);
		setTimeout(() => {
			checklistInputRef.current?.focus();
		}, 100);
	};

	const addTask = () => {
		if (!title.trim()) return;
		Store.addTask({
			title, description, tags, subTasks, assignee, dueDate, priority,
			status: defaultStatus,
			createdAt: new Date().toISOString(),
		});
		window.dispatchEvent(new Event("storage-update"));
		onClose();
	};

	return (
		<>
			{/* Overlay */}
			<div className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm" onClick={onClose} />

			{/* Main Modal */}
			<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[750px] max-h-[90vh] bg-[var(--bg-primary)] border-2 border-[var(--accent)] rounded-xl shadow-[0_0_40px_rgba(var(--accent-rgb),0.2)] z-[70] flex flex-col overflow-hidden">

				{/* Header Section */}
				<div className="p-6 pb-2 flex justify-between items-start flex-shrink-0">
					<div className="flex-1">
						<input
							autoFocus
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Task Title..."
							className="w-full bg-transparent text-2xl font-bold outline-none border-none text-[var(--text-primary)] focus:ring-0 p-0"
						/>
						<p className="text-sm text-[var(--text-secondary)] mt-1">in list <span className="underline decoration-[var(--accent)]">{defaultStatus}</span></p>
					</div>
					<button onClick={onClose} className="p-2 hover:bg-[var(--bg-hover)] rounded-full text-[var(--text-secondary)] transition-colors">
						<Icons.Close size={20} />
					</button>
				</div>

				{/* Content Area */}
				<div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar overflow-x-hidden">
					<div className="flex flex-col md:flex-row gap-8 items-start relative">

						{/* Left Side */}
						<div className="flex-[3] w-full space-y-8">
							<div className="flex flex-wrap gap-6">
								{tags.length > 0 && (
									<div>
										<h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-2 tracking-widest">Labels</h4>
										<div className="flex gap-2 flex-wrap">
											{tags.map(t => (
												<span key={t.id} className="h-8 px-3 rounded flex items-center text-white text-xs font-bold shadow-md" style={{ background: t.color }}>{t.name}</span>
											))}
										</div>
									</div>
								)}
								{assignee && (
									<div>
										<h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-2 tracking-widest">Member</h4>
										<div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--accent)] p-1 pr-3 rounded-full">
											<div className="w-6 h-6 rounded-full bg-[var(--accent)] text-[10px] flex items-center justify-center text-white font-bold">{assignee[0]}</div>
											<span className="text-xs text-[var(--text-primary)] font-medium">{assignee}</span>
										</div>
									</div>
								)}
							</div>

							<div className="space-y-3">
								<div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">
									<Icons.Description size={18} className="text-[var(--accent)]" /> Description
								</div>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Add a more detailed description..."
									className="w-full min-h-[120px] bg-[var(--bg-secondary)] border-2 border-[var(--accent)]/30 focus:border-[var(--accent)] rounded-lg p-4 text-sm text-[var(--text-primary)] outline-none transition-all resize-none"
								/>
							</div>

							{(subTasks.length > 0 || showChecklist) && (
								<div className="animate-in fade-in slide-in-from-top-4 duration-300">
									<div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider mb-4">
										<Icons.Checklist size={18} className="text-[var(--accent)]" /> Checklist
									</div>
									<div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent)] rounded-xl p-5 shadow-inner">
										<div className="space-y-3 mb-4">
											{subTasks.map((st, i) => (
												<div key={i} className="flex items-center gap-3 group">
													<input type="checkbox" className="w-5 h-5 rounded border-[var(--accent)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer accent-[var(--accent)]" />
													<span className="text-sm text-[var(--text-primary)] flex-1">{st}</span>
												</div>
											))}
										</div>
										<div className="relative">
											<input
												ref={checklistInputRef}
												className="w-full bg-transparent border-b-2 border-[var(--accent)]/20 py-2 text-sm outline-none focus:border-[var(--accent)] text-[var(--text-primary)] transition-all"
												placeholder="Add an item..."
												onKeyDown={(e) => {
													if (e.key === 'Enter' && e.target.value.trim()) {
														setSubTasks([...subTasks, e.target.value]);
														e.target.value = "";
													}
												}}
											/>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Right Side (Sidebar) - Yahan Positioning Fix ki hai */}
						<div className="flex-1 w-full md:max-w-[190px] space-y-3 relative" ref={panelRef}>
							<h4 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Add to card</h4>
							<SidebarButton icon={<Icons.Member />} label="Members" onClick={() => setActivePanel("members")} />
							<SidebarButton icon={<Icons.Label />} label="Labels" onClick={() => setActivePanel("labels")} />
							<SidebarButton icon={<Icons.Checklist />} label="Checklist" onClick={handleChecklistToggle} />
							<SidebarButton icon={<Icons.Date />} label="Dates" onClick={() => setActivePanel("dates")} />
							<SidebarButton icon={<Icons.Priority />} label="Priority" onClick={() => setActivePanel("priority")} />

							{/* Fixed Panel Positioning: Ab ye sidebar ke upar ya side mein theek se khulega */}
							{activePanel && (
								<div className="absolute top-0 right-0 md:right-0 w-[280px] z-[100] animate-in fade-in zoom-in-95 origin-top-right">
									<div className="bg-[var(--bg-primary)] border-2 border-[var(--accent)] rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] p-4 overflow-hidden mt-2">
										<div className="flex justify-between items-center mb-4 border-b border-[var(--border)] pb-2">
											<span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">{activePanel}</span>
											<button onClick={() => setActivePanel(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
												<Icons.Close size={14} />
											</button>
										</div>
										<div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
											{activePanel === "labels" && <LabelsPanel tags={tags} setTags={setTags} />}
											{activePanel === "dates" && <DatesPanel dueDate={dueDate} setDueDate={setDueDate} />}
											{activePanel === "members" && <MembersPanel assignee={assignee} setAssignee={setAssignee} />}
											{activePanel === "priority" && <PriorityPanel priority={priority} setPriority={setPriority} />}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 pt-4 border-t border-[var(--border)] bg-[var(--bg-primary)] rounded-b-xl flex justify-end gap-3 flex-shrink-0">
					<button onClick={onClose} className="px-6 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-lg font-semibold transition-all">Cancel</button>
					<button
						onClick={addTask}
						disabled={!title.trim()}
						className={`px-10 py-2.5 rounded-lg font-bold transition-all border-2 ${title.trim()
								? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_5px_15px_rgba(var(--accent-rgb),0.4)] hover:brightness-110 active:scale-95"
								: "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] cursor-not-allowed"
							}`}
					>
						Add Card
					</button>
				</div>
			</div>
		</>
	);
}

function SidebarButton({ icon, label, onClick }) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-3 px-3 py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border-2 border-transparent hover:border-[var(--accent)] rounded-lg text-[var(--text-primary)] text-sm font-semibold transition-all w-full text-left group"
		>
			<span className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">{icon}</span>
			{label}
		</button>
	);
}