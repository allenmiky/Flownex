export default function DatesPanel({ dueDate, setDueDate }) {
	return (
		<div className="space-y-2">
			<input
				type="date"
				value={dueDate || ""}
				onChange={(e) => setDueDate(e.target.value)}
				className="fn-input w-full"
			/>

			{dueDate && (
				<button
					onClick={() => setDueDate("")}
					className="text-xs text-red-500"
				>
					Remove date
				</button>
			)}
		</div>
	);
}
