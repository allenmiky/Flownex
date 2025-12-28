import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function ToastContainer({ toasts, onClose }) {
	return (
		<div className="
			fixed top-4 right-4 z-[99999]
			flex flex-col gap-2
		">
			{toasts.map((toast) => {
				const Icon =
					toast.type === "success"
						? CheckCircle
						: toast.type === "error"
							? AlertCircle
							: Info;

				return (
					<div
						key={toast.id}
						className={`
							min-w-[280px]
							max-w-sm
							p-4 rounded-xl
							shadow-2xl
							flex gap-3 items-start
							bg-[var(--bg-secondary)]
							border border-white/10
							animate-in slide-in-from-right fade-in
							${toast.type === "error"
								? "border-red-500/40"
								: toast.type === "success"
									? "border-green-500/40"
									: "border-blue-500/40"}
						`}
					>
						<Icon
							className={`mt-0.5 ${toast.type === "error"
									? "text-red-400"
									: toast.type === "success"
										? "text-green-400"
										: "text-blue-400"
								}`}
							size={18}
						/>

						<div className="flex-1">
							<p className="text-sm text-white font-medium">
								{toast.title || "Notice"}
							</p>
							{toast.message && (
								<p className="text-xs text-white/70 mt-1">
									{toast.message}
								</p>
							)}
						</div>

						<button
							onClick={() => onClose(toast.id)}
							className="text-white/40 hover:text-white"
						>
							<X size={14} />
						</button>
					</div>
				);
			})}
		</div>
	);
}
