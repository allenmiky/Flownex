import { useState } from "react";

export default function AddBoard({ onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    function handleSubmit() {
        if (!name.trim()) return;

        onSubmit({
            name,
            image,
        });

        onClose();
    }

    return (
        <>
            {/* Overlay: Backdrop blur add kiya hai taake focus modal par rahe */}
            <div className="fn-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" onClick={onClose} />

            {/* Modal: Card layout with consistent padding */}
            <div className="fn-modal fn-card fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-full max-w-md p-6 rounded-2xl border border-[#ffffff10] bg-[#0d1117] shadow-2xl">

                <h3 className="fn-modal-title text-xl font-bold text-white mb-6">Create New Board</h3>

                <div className="fn-flex fn-gap-md" style={{ flexDirection: "column", gap: "20px" }}>
                    {/* Board Name Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Board Name</label>
                        <input
                            className="fn-input w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:border-[#798df2] outline-none transition-all"
                            placeholder="Enter board title..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Image Upload Style (Minimalist) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Cover Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="fn-input w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#798df220] file:text-[#798df2] hover:file:bg-[#798df230] cursor-pointer"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                </div>

                {/* Actions: Buttons aligned to the right */}
                <div className="fn-actions flex justify-end gap-3 mt-8">
                    <button
                        className="fn-btn-secondary px-6 py-2 rounded-xl text-sm font-bold opacity-70 hover:opacity-100 transition-opacity"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="fn-btn px-6 py-2 rounded-xl text-sm font-bold bg-[#798df2] text-white hover:bg-[#6879d1] transition-all active:scale-95"
                        onClick={handleSubmit}
                    >
                        Create Board
                    </button>
                </div>
            </div>
        </>
    );
}