import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function TaskColumn({ columnId, title, tasks }) {
  return (
    <div className="flex-shrink-0 w-72">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 p-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-3 h-3 rounded-[var(--radius-sm)] bg-[var(--accent)]"></div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </h3>
          <span className="text-xs px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--bg-muted)] text-[var(--text-secondary)]">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]">
          ⋮
        </button>
      </div>

      {/* Droppable Area for Tasks */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`rounded-[var(--radius-lg)] border min-h-[200px] p-3 ${
              snapshot.isDraggingOver 
                ? "border-dashed border-[var(--accent)] bg-[rgba(var(--accent),0.05)]" 
                : "border-solid border-[var(--border-color)] bg-[var(--bg-secondary)]"
            }`}
          >
            {/* Tasks List */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
              />
            ))}
            {provided.placeholder}

            {/* Add Task Button */}
            <button className="w-full mt-3 p-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add a card
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
}