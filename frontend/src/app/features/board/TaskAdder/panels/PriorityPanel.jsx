const PRIORITIES = [
	{ id: "low", label: "Low", color: "#22c55e" },
	{ id: "medium", label: "Medium", color: "#facc15" },
	{ id: "high", label: "High", color: "#ef4444" },
];

export default function PriorityPanel({ priority, setPriority }) {
	return (
		<div className="space-y-2">
			{PRIORITIES.map((p) => {
				const active = priority === p.id;

				return (
					<button
						key={p.id}
						onClick={() => setPriority(p.id)}
						className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm border ${active ? "text-white" : ""
							}`}
						style={{
							background: active ? p.color : "transparent",
							borderColor: p.color,
							color: active ? "#fff" : p.color,
						}}
					>
						<span
							className="w-3 h-3 rounded-full"
							style={{ background: p.color }}
						/>
						{p.label}
					</button>
				);
			})}
		</div>
	);
}
