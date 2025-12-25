export default function CommandInput({ value, onChange }) {
	return (
		<input
			autoFocus
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Type a command..."
			className="w-full border-b border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none"
		/>
	);
}
