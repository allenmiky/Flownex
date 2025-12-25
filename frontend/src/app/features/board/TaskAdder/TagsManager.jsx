import { useState } from "react";

export default function TagsManager({ tags, setTags }) {
	const [currentTag, setCurrentTag] = useState("");

	function addTag() {
		if (currentTag.trim() && !tags.includes(currentTag.trim())) {
			setTags([...tags, currentTag.trim()]);
			setCurrentTag("");
		}
	}

	function removeTag(tagToRemove) {
		setTags(tags.filter(tag => tag !== tagToRemove));
	}

	return (
		<div>
			<label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
				Tags
			</label>
			<div className="flex gap-2 mb-2">
				<input
					className="fn-input text-sm flex-1"
					placeholder="Add a tag..."
					value={currentTag}
					onChange={(e) => setCurrentTag(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && addTag()}
				/>
				<button
					onClick={addTag}
					className="fn-btn-secondary text-sm px-2 py-1"
				>
					+
				</button>
			</div>
			<div className="flex flex-wrap gap-1">
				{tags.map((tag, index) => (
					<span
						key={index}
						className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[var(--bg-muted)] text-[var(--text-secondary)]"
					>
						{tag}
						<button
							onClick={() => removeTag(tag)}
							className="text-xs hover:text-[var(--text-primary)]"
						>
							✕
						</button>
					</span>
				))}
			</div>
		</div>
	);
}