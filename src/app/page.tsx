"use client";
import { Card } from "@/components/Card";
import { Note, notes } from "@/constants";
import { getRandomNotes } from "@/utils/getRandomNotes";
import { useEffect, useState } from "react";

export default function Home() {
	const [numOfCards, setNumOfCards] = useState(5);
	const [timeToPlay, setTimeToPlay] = useState(3);
	const [playing, setPlaying] = useState(false);

	const [playingNotes, setPlayingNotes] = useState<Note[]>([]);
	const [currentNote, setCurrentNote] = useState<Note>();
	const [cardStates, setCardStates] =
		useState<Record<Note, { success: boolean; playedNote: Note }>>();

	const startGame = () => {
		setPlaying(true);
		setPlayingNotes(getRandomNotes(numOfCards));
	};

	useEffect(() => {
		if (!playing || playingNotes.length === 0) return;

		playingNotes.forEach((note, i) =>
			setTimeout(() => setCurrentNote(note), 1000 * timeToPlay * i + 1)
		);

		setTimeout(() => {
			setPlaying(false);
			setPlayingNotes([]);
			//@ts-ignore
			setCurrentNote("");
		}, 1000 * timeToPlay * numOfCards + 1);
	}, [numOfCards, playing, playingNotes, timeToPlay]);

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<div className="mb-8">
				{!playing && (
					<div className="flex flex-col items-center">
						<div className="mb-4">
							Num of notes:{" "}
							<input
								className="border border-gray-300 rounded px-2 py-1"
								type="number"
								value={numOfCards}
								onChange={(e) =>
									setNumOfCards(
										Number(e.target.value) < 1 ? 1 : Number(e.target.value)
									)
								}
							/>
						</div>
						<div className="mb-4">
							Time to play (s):{" "}
							<input
								className="border border-gray-300 rounded px-2 py-1"
								type="number"
								value={timeToPlay}
								onChange={(e) =>
									setTimeToPlay(
										Number(e.target.value) < 0.5 ? 0.5 : Number(e.target.value)
									)
								}
							/>
						</div>
						<button
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
							onClick={startGame}
						>
							Start playing
						</button>
					</div>
				)}

				<div className="flex items-center justify-center">
					{/* Adjusted Card component styling */}
					{playing && (
						<div className="w-96 h-72 ">
							{/* @ts-ignore */}
							<Card note={currentNote} timerDuration={timeToPlay} />
						</div>
					)}
				</div>
			</div>
			{/* <NoteDetector /> */}
		</main>
	);
}
