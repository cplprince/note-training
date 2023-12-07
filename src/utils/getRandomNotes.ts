import { Note, notes } from "@/constants";

export const getRandomNotes = (n: number): Note[] => {
	const randomNotes: Note[] = [];
	let lastNote: Note | null = null;

	for (let i = 0; i < n; i++) {
		let randomIndex = Math.floor(Math.random() * notes.length);
		let randomNote = notes[randomIndex];

		// Check if the last generated note is the same as the current one
		while (randomNote === lastNote) {
			randomIndex = Math.floor(Math.random() * notes.length);
			randomNote = notes[randomIndex];
		}

		randomNotes.push(randomNote);
		lastNote = randomNote;
	}

	return randomNotes;
};
