import TaskBar from "./TaskBar/TaskBar";
import { DragDropContext } from "@hello-pangea/dnd";

export default function Board() {
	return (
		<div className="h-full flex flex-col">
			<TaskBar />
		</div>
	);
}
