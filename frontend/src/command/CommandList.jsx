export default function CommandList({ items, onSelect }) {
	return (
		<div className="max-h-64 overflow-y-auto">
			{items.map((cmd) => (
				<button
					key={cmd.id}
					onClick={() => onSelect(cmd)}
					className="w-full px-4 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
				>
					{cmd.label}
				</button>
			))}
		</div>
	);
}
