import TagsManager from "./TagsManager";
import SubtasksManager from "./SubtasksManager";

export default function TaskMetadata({
	tags,
	setTags,
	subTasks,
	setSubTasks,
	assignee,
	setAssignee,
	isExpanded,
	toggleSection
}) {
	return (
		<div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden">
			{/* Section Header */}
			<button
				onClick={toggleSection}
				className="w-full flex justify-between items-center p-3 bg-[var(--bg-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
			>
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
					<span className="font-medium text-[var(--text-primary)] text-sm">
						Metadata
					</span>
				</div>
				<svg
					className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{/* Collapsible Content */}
			{isExpanded && (
				<div className="p-3 space-y-3">
					{/* Assignee (First - most important) */}
					<div>
						<label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
							Assign to
						</label>
						<input
							className="fn-input text-sm"
							placeholder="Team member name"
							value={assignee}
							onChange={(e) => setAssignee(e.target.value)}
						/>
					</div>

					{/* Tags */}
					<TagsManager
						tags={tags}
						setTags={setTags}
					/>

					{/* Subtasks */}
					<SubtasksManager
						subTasks={subTasks}
						setSubTasks={setSubTasks}
					/>
				</div>
			)}
		</div>
	);
}