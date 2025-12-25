export default function TaskDetails({
	dueDate,
	setDueDate,
	priority,
	setPriority,
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
						Details
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
				<div className="p-3">
					<div className="grid grid-cols-2 gap-3">
						{/* Due Date */}
						<div>
							<label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
								Due Date
							</label>
							<input
								type="date"
								className="fn-input text-sm"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
							/>
						</div>

						{/* Priority */}
						<div>
							<label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
								Priority
							</label>
							<select
								className="fn-input text-sm"
								value={priority}
								onChange={(e) => setPriority(e.target.value)}
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}