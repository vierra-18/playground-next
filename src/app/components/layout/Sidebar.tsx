"use client";
import { renderIcon } from "@/app/utilities/helpers/helper";
import useNotes from "@/app/utilities/hooks/useNotes";
import type { Note } from "@/types/types";
import type React from "react";
import { IoCreateOutline } from "react-icons/io5";
import NoteItems from "../NoteItems";

// type SidebarProps = {
// 	notes: Note[];
// 	onEditNote: (note: {
// 		id: string;
// 		title: string;
// 		text: string;
// 		important?: boolean;
// 		noteColor?: string;
// 	}) => void; // Callback to pass note back to parent
// 	onNewNote: () => void; // Callback to clear the current editing state
// };

const Sidebar = () => {
	return (
		<div className="no-scrollbar relative flex  min-h-full min-w-52 flex-col self-start overflow-y-auto z-10 border-r border-black">
			<div className="sticky top-0 flex min-h-16 items-center justify-between border-black border-b  bg-zinc-800 px-6">
				<h1 className="font-mono uppercase">Sidebar</h1>
				{/* Button to clear editing and create a new note */}
				{/* <button
					onClick={onNewNote}
					className="flex w-fit items-center justify-center"
					type="button"
				>
					{renderIcon(IoCreateOutline)}
				</button> */}
			</div>
		</div>
	);
};

export default Sidebar;
