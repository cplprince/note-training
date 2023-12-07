import { Note, noteFrequencies } from "@/constants";
import React, { FC, useEffect, useState } from "react";

export const NoteDetector: FC = () => {
	const [detectedNote, setDetectedNote] = useState("");
	const [audioContext, setAudioContext] = useState<AudioContext>();

	useEffect(() => {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			console.error("getUserMedia is not supported in this browser");
			return;
		}
		console.log("t");
		const getMicAccess = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				const context = new AudioContext();
				setAudioContext(context);

				const analyser = context.createAnalyser();
				analyser.fftSize = 2048;

				const source = context.createMediaStreamSource(stream);
				source.connect(analyser);

				const processData = () => {
					const bufferLength = analyser.frequencyBinCount;
					const dataArray = new Uint8Array(bufferLength);
					analyser.getByteTimeDomainData(dataArray);

					// Your pitch detection logic here
					const pitch = getPitchFromDataArray(dataArray); // Implement this function

					// Convert pitch to note
					if (!pitch) return;
					const detected = getNoteFromPitch(pitch); // Implement this function

					setDetectedNote(detected);
					requestAnimationFrame(processData);
				};

				processData();
			} catch (error) {
				console.error("Error accessing microphone:", error);
			}
		};

		getMicAccess();

		return () => {
			if (audioContext) {
				audioContext.close();
			}
		};
	}, [audioContext]);

	const getPitchFromDataArray = (dataArray: Uint8Array) => {
		if (!audioContext) return;
		const sampleRate = audioContext.sampleRate;
		const bufferLength = dataArray.length;
		const correlationBuffer = new Float32Array(bufferLength);

		// Autocorrelation: Calculate correlation values
		for (let lag = 0; lag < bufferLength; lag++) {
			let sum = 0;
			for (let i = 0; i < bufferLength - lag; i++) {
				sum +=
					((dataArray[i] - 128) / 128) * ((dataArray[i + lag] - 128) / 128);
			}
			correlationBuffer[lag] = sum;
		}

		// Find the peak in the autocorrelation buffer (excluding the first element)
		let bestLag = 0;
		let bestCorrelation = correlationBuffer[0];
		for (let i = 1; i < bufferLength; i++) {
			if (correlationBuffer[i] > bestCorrelation) {
				bestCorrelation = correlationBuffer[i];
				bestLag = i;
			}
		}

		// Calculate frequency from the best lag value
		const fundamentalFrequency = sampleRate / bestLag;
		return fundamentalFrequency;
	};

	const getNoteFromPitch = (pitch: number) => {
		const tolerance = 8; // Adjust this tolerance to match frequencies to notes
		for (const note in noteFrequencies) {
			const frequency = noteFrequencies[note as Note];
			console.log(frequency);
			if (Math.abs(pitch - frequency) <= tolerance) {
				return note;
			}
		}

		return "Unknown"; // If no note within the tolerance is found
	};

	return (
		<div>
			<p>Detected Note: {detectedNote}</p>
		</div>
	);
};
