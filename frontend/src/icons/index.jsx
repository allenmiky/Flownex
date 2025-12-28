import { Tag, Menu, Calendar, User, Users, CheckSquare, Check, Flag, Clock, Plus, Edit3, Trash2, File, MessageSquare, MoreHorizontal, X, AlignLeft, GripVertical, AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Settings } from "lucide-react";

const size = 16;

export const Icons = {
	Add: (props) => <Plus size={size} {...props} />,
	Edit: (props) => <Edit3 size={size} {...props} />,
	Delete: (props) => <Trash2 size={size} {...props} />,
	Close: (props) => <X size={size} {...props} />,
	More: (props) => <MoreHorizontal size={size} {...props} />,
	Drag: (props) => <GripVertical size={size} {...props} />,
	Description: (props) => <AlignLeft size={size} {...props} />,
	Label: (props) => <Tag size={size} {...props} />,
	Date: (props) => <Calendar size={size} {...props} />,
	Time: (props) => <Clock size={size} {...props} />,
	Checklist: (props) => <CheckSquare size={size} {...props} />,
	Check: (props) => <Check size={size} {...props} />,
	Member: (props) => <User size={size} {...props} />,
	Members: (props) => <Users size={size} {...props} />,
	Priority: (props) => <Flag size={size} {...props} />,
	Alert: (props) => <AlertCircle size={size} {...props} />,
	Attachment: (props) => <File size={size} {...props} />,
	Comment: (props) => <MessageSquare size={size} {...props} />,
	ChevronDown: (props) => <ChevronDown size={size} {...props} />, 
	ChevronLeft: (props) => <ChevronLeft size={size} {...props} />, 
	ChevronRight: (props) => <ChevronRight size={size} {...props} />, 
	Settings: (props) => <Settings size={size} {...props} />, 
	Menu: (props) => <Menu size={size} {...props} />, 

};