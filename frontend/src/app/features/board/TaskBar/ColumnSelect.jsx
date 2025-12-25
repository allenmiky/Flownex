export default function ColumnSelect({ columns }) {
	return (
		<select className="rounded-lg bg-zinc-800 px-2 text-sm text-white">
			{columns.map((c) => (
				<option key={c.id} value={c.id}>
					{c.title}
				</option>
			))}
		</select>
	);
}
