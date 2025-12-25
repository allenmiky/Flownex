import TaskCard from "./TaskCard";

export default function Column({ column }) {
  return (
    <div className="w-72 rounded-xl bg-zinc-100 p-3 dark:bg-zinc-900">
      <h3 className="mb-3 font-medium">{column.title}</h3>

      <div className="space-y-2">
        {column.tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
