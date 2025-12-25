import { useState } from "react";

export default function StatusDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Status Button */}
      <button
        className="fn-btn-secondary fn-flex fn-gap-2"
        onClick={() => setOpen(v => !v)}
      >
        <span>Status</span>
      </button>

      {/* Dropdown Content */}
      {open && (
        <div
          className="fn-card absolute top-10 right-0 w-60 p-4 bg-opacity-75 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(2,6,23,0.85)"
          }}
        >
          <div className="fn-gap-4">
            <strong className="text-sm text-white">Team Online</strong>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>

          <div className="fn-gap-4 mt-4">
            <strong className="text-sm text-white">Upcoming Deadlines</strong>
            <div className="text-xs text-gray-400">
              • Campaign Review<br />
              • Design Approval<br />
              • Sprint Planning
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
