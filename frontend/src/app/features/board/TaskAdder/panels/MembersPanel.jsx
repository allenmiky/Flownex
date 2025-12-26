export default function MembersPanel({ assignee, setAssignee }) {
	return (
		<div className="space-y-2">
			<input
				value={assignee}
				onChange={(e) => setAssignee(e.target.value)}
				placeholder="Member name"
				className="fn-input w-full"
			/>

			{assignee && (
				<div className="flex items-center gap-2 text-sm">
					<div className="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
						{assignee.charAt(0).toUpperCase()}
					</div>
					<span>{assignee}</span>
				</div>
			)}
		</div>
	);
}
