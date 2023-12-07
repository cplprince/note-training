import { Note } from "@/constants";
import { FC, useEffect, useState } from "react";

type Props = {
	note: Note;
	timerDuration: number; // Duration in seconds for the timer
};

export const Card: FC<Props> = ({ note, timerDuration }) => {
	const [timer, setTimer] = useState(timerDuration - 1);
	const [reset, setReset] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [timer]);

	useEffect(() => {
		setTimer(timerDuration - 1);
		setReset(true);

		const timeout = setTimeout(() => {
			setReset(false);
		}, 100);

		return () => clearTimeout(timeout);
	}, [note, timerDuration]);

	const timerWidth = reset ? 100 : (timer / timerDuration) * 100;

	return (
		<div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-lg shadow-lg p-6">
			<div className="text-4xl font-semibold mb-4">{note}</div>

			<div className="w-full h-4 bg-gray-300 rounded-lg mb-4">
				<div
					className="h-full bg-blue-500 rounded-lg"
					style={{
						width: `${timerWidth}%`,
						transition: reset ? "none" : "width 1s linear",
					}}
				/>
			</div>

			<div className="text-lg text-center">{timer + 1}s</div>
		</div>
	);
};
