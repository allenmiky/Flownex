const AVAILABLE_LABELS = [
	{ id: "green", color: "#61bd4f", name: "Green" },
	{ id: "yellow", color: "#f2d600", name: "Yellow" },
	{ id: "orange", color: "#ff9f1a", name: "Orange" },
	{ id: "red", color: "#eb5a46", name: "Red" },
	{ id: "purple", color: "#c377e0", name: "Purple" },
	{ id: "blue", color: "#0079bf", name: "Blue" },
];

export default function LabelsPanel({ tags, setTags }) {
	function toggleLabel(label) {
		setTags((prev) =>
			prev.find((l) => l.id === label.id)
				? prev.filter((l) => l.id !== label.id)
				: [...prev, label]
		);
	}

	return (
		<div className="space-y-2">
			{AVAILABLE_LABELS.map((label) => {
				const isActive = tags.some((l) => l.id === label.id);

				return (
					<div
						key={label.id}
						onClick={() => toggleLabel(label)}
						className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded"
						style={{
							background: isActive ? label.color : "transparent",
							border: `1px solid ${label.color}`,
							color: isActive ? "#fff" : label.color,
						}}
					>
						<span
							className="w-3 h-3 rounded-full"
							style={{ background: label.color }}
						/>
						<span className="text-sm">{label.name}</span>
					</div>
				);
			})}
		</div>
	);
}
