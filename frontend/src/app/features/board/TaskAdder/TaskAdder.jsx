import TaskAdderOverlay from "./TaskAdderOverlay";
import TaskAdderForm from "./TaskAdderForm";

export default function TaskAdder({ onClose }) {
	return (
		<>
			<TaskAdderOverlay onClose={onClose} />
			<TaskAdderForm onClose={onClose} />
		</>
	);
}
