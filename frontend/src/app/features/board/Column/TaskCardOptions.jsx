import { useEffect, useRef, useState } from "react";
import {
	ExternalLink,
	Tag,
	Users,
	Calendar,
	ArrowRight,
	Copy,
	Link2,
	Archive,
	Trash2,
} from "lucide-react";

export default function TaskCardOptions({ task, anchorEl, onClose, onSelect }) {
	const optionsRef = useRef(null);
	const [style, setStyle] = useState({});
	const [open, setOpen] = useState(false);

	/* 📍 LOCK menu to card (LEFT aligned, center feel) */
	const updatePosition = () => {
		if (!anchorEl) return;

		const rect = anchorEl.getBoundingClientRect();

		setStyle({
			position: "fixed",
			top: rect.top + rect.height / 2,
			left: rect.right + 12,
			transform: "translateY(-50%)",
			zIndex: 9999,
		});
	};

	useEffect(() => {
		updatePosition();
		setOpen(true);

		window.addEventListener("scroll", updatePosition, true);
		window.addEventListener("resize", updatePosition);

		return () => {
			window.removeEventListener("scroll", updatePosition, true);
			window.removeEventListener("resize", updatePosition);
		};
	}, [anchorEl]);

	/* ❌ outside click */
	useEffect(() => {
		const handler = (e) => {
			if (optionsRef.current && !optionsRef.current.contains(e.target)) {
				setOpen(false);
				setTimeout(onClose, 160);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [onClose]);

	const options = [
		{ id: "open", label: "Open card", icon: ExternalLink },
		{ id: "labels", label: "Edit labels", icon: Tag },
		{ id: "members", label: "Change members", icon: Users },
		{ id: "dates", label: "Edit dates", icon: Calendar },
		{ divider: true },
		{ id: "move", label: "Move", icon: ArrowRight },
		{ id: "copy", label: "Copy card", icon: Copy },
		{ id: "link", label: "Copy link", icon: Link2 },
		{ divider: true },
		{ id: "archive", label: "Archive", icon: Archive },
		{ id: "delete", label: "Delete", icon: Trash2, danger: true },
	];

	return (
		<div
			ref={optionsRef}
			style={style}
			className={`
				w-56
				bg-[var(--bg-secondary)]
				border border-white/10
				rounded-xl
				shadow-2xl
				py-2
				origin-left
				transition-all duration-150 ease-out
				${open
					? "opacity-100 translate-x-0 scale-100"
					: "opacity-0 -translate-x-2 scale-95"}
			`}
		>
			{/* Header */}
			<div className="px-3 pb-2 border-b border-white/10">
				<p className="text-xs font-semibold text-white truncate">
					{task.title}
				</p>
				<p className="text-[11px] text-white/50">
					Card actions
				</p>
			</div>

			<ul className="py-1">
				{options.map((opt, i) =>
					opt.divider ? (
						<li key={i} className="my-1 border-t border-white/10" />
					) : (
						<li key={opt.id}>
							<button
								onClick={() => onSelect(opt.id)}
								className={`
									w-full px-3 py-2 text-sm
									flex items-center gap-3
									text-left transition
									${opt.danger
										? "text-red-400 hover:bg-red-500/10"
										: "text-white/80 hover:bg-white/5 hover:text-white"}
								`}
							>
								<opt.icon className="w-4 h-4 opacity-80" />
								{opt.label}
							</button>
						</li>
					)
				)}
			</ul>
		</div>
	);
}
