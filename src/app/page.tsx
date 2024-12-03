// import Image from "next/image";
import Dashboard from "./components/layout/Dashboard";
// import NoteList from "./components/NoteList";

export default function Home() {
	return (
		<div className="min-h-screen max-w-screen bg-purple-800/10">
			<main className="grid h-full w-full place-items-start">
				<div className="h-16 absolute top-0 bg-zinc-800 w-full z-0" />
				<div className="flex h-full w-full flex-col items-center justify-center lg:container ">
					{/* <Sidebar /> */}
					<Dashboard />
				</div>
			</main>
		</div>
	);
}
