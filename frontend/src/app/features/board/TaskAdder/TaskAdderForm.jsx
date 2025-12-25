import { useState } from "react";
import { Store } from "../../../data/store";
import TaskBasicInfo from "./TaskBasicInfo";
import TaskDetails from "./TaskDetails";
import TaskMetadata from "./TaskMetadata";

export default function TaskAdderForm({ onClose }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [priority, setPriority] = useState("medium");
	const [tags, setTags] = useState([]);
	const [subTasks, setSubTasks] = useState([]);
	const [assignee, setAssignee] = useState("");
	const [expandedSections, setExpandedSections] = useState({
		basic: true,
		details: true,
		metadata: true
	});

	function addTask() {
		if (!title.trim()) return;

		Store.addTask({
			title,
			description,
			dueDate,
			priority,
			tags,
			subTasks,
			assignee,
			status: "todo",
			createdAt: new Date().toISOString(),
		});

		window.dispatchEvent(new Event("storage-update"));
		onClose();
	}

	const toggleSection = (section) => {
		setExpandedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}));
	};

	return (
		<>
			<div className="fn-overlay" onClick={onClose} />

			<div
				className="fn-modal fn-card"
				style={{
					maxWidth: "500px",
					maxHeight: "85vh",
					display: "flex",
					flexDirection: "column"
				}}
			>
				{/* Fixed Header */}
				<div className="flex justify-between items-center mb-4 flex-shrink-0">
					<h3 className="fn-modal-title">Add New Task</h3>
					<button
						onClick={onClose}
						className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl"
					>
						✕
					</button>
				</div>

				{/* Scrollable Content */}
				<div className="space-y-3 flex-1 overflow-y-auto pr-1" style={{ maxHeight: "calc(85vh - 140px)" }}>
					{/* Basic Info Section */}
					<TaskBasicInfo
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						isExpanded={expandedSections.basic}
						toggleSection={() => toggleSection('basic')}
					/>

					{/* Details Section */}
					<TaskDetails
						dueDate={dueDate}
						setDueDate={setDueDate}
						priority={priority}
						setPriority={setPriority}
						isExpanded={expandedSections.details}
						toggleSection={() => toggleSection('details')}
					/>

					{/* Metadata Section */}
					<TaskMetadata
						tags={tags}
						setTags={setTags}
						subTasks={subTasks}
						setSubTasks={setSubTasks}
						assignee={assignee}
						setAssignee={setAssignee}
						isExpanded={expandedSections.metadata}
						toggleSection={() => toggleSection('metadata')}
					/>
				</div>

				{/* Fixed Actions Footer */}
				<div className="fn-actions mt-4 pt-4 border-t border-[var(--border-color)] flex-shrink-0">
					<button className="fn-btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button
						className="fn-btn"
						onClick={addTask}
						disabled={!title.trim()}
						style={{ opacity: !title.trim() ? 0.5 : 1 }}
					>
						Add Task
					</button>
				</div>
			</div>
		</>
	);
}