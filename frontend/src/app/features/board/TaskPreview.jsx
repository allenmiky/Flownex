export default function TaskPreview({ task }) {
  return (
    <div className="fn-card p-4 mb-4">
      <h4 className="font-semibold">{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
}
