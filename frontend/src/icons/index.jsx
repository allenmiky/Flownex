import { Tag, Calendar, User, Users, CheckSquare, Check, Flag, Clock, Plus, Edit3, Trash2, File, MessageSquare, MoreHorizontal, X, AlignLeft, GripVertical, AlertCircle } from "lucide-react";

/**
 * 🔥 Centralized Icon System
 * - Consistent size
 * - Easy theme control
 * - Production ready
 */

const size = 16;

export const Icons = {
	/* ----- Core actions ----- */
	Add: (props) => <Plus size={size} {...props} />,
	Edit: (props) => <Edit3 size={size} {...props} />,
	Delete: (props) => <Trash2 size={size} {...props} />,
	Close: (props) => <X size={size} {...props} />,
	More: (props) => <MoreHorizontal size={size} {...props} />,
	Drag: (props) => <GripVertical size={size} {...props} />,

	/* ----- Task content ----- */
	Description: (props) => <AlignLeft size={size} {...props} />,

	/* ----- Labels ----- */
	Label: (props) => <Tag size={size} {...props} />,

	/* ----- Dates & Time ----- */
	Date: (props) => <Calendar size={size} {...props} />,
	Time: (props) => <Clock size={size} {...props} />,

	/* ----- Checklist / Subtasks ----- */
	Checklist: (props) => <CheckSquare size={size} {...props} />,
	Check: (props) => <Check size={size} {...props} />,

	/* ----- Members ----- */
	Member: (props) => <User size={size} {...props} />,
	Members: (props) => <Users size={size} {...props} />,

	/* ----- Priority ----- */
	Priority: (props) => <Flag size={size} {...props} />,
	Alert: (props) => <AlertCircle size={size} {...props} />,

	/* ----- Meta ----- */
	Attachment: (props) => <File size={size} {...props} />,
	Comment: (props) => <MessageSquare size={size} {...props} />,
};
