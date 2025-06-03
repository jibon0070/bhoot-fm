"use client";

import { Pause, Play } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";

const activeColor = "#ff3c00";
const inactiveColor = "white";

function useAudioBuffer(url: string): AudioBuffer | null {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    (async () => {
      const audioContext = new AudioContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      console.time("decodeAudioData");

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.timeEnd("decodeAudioData");
      setAudioBuffer(audioBuffer);
    })();
  }, []);

  return audioBuffer;
}

export default function Audio({ url }: { url: string }) {
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const audioBuffer = useAudioBuffer(url);

  const audioRef = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio) return;

    setAudio(audio);

    setTotalDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
  }, []);

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;

      canvas.width = canvas.parentElement!.clientWidth;
      // canvas.height = window.innerHeight;
      canvas.height = 70;
      const canvasContext = canvas.getContext("2d")!;
      canvasContext.lineWidth = 1;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

      const splitPoint = Math.round(
        (currentTime / totalDuration) * canvasWidth,
      );

      if (!audioBuffer) {
        drawBlankPlayback({
          canvasContext,
          canvasHeight,
          canvasWidth,
          splitPoint,
        });
      }

      if (!audioBuffer) return;

      const channelData = audioBuffer.getChannelData(0);
      const numSamples = channelData.length;
      const sampleStep = Math.floor(numSamples / canvasWidth);
      const amplitudeScale = canvasHeight / 2;

      const w = 1;
      for (let i = 0; i < canvasWidth; i += w) {
        const sampleIndex = i * sampleStep;
        const sampleValue = channelData[sampleIndex] * amplitudeScale * 3;
        if (i < splitPoint) {
          canvasContext.fillStyle = activeColor;
        } else {
          canvasContext.fillStyle = inactiveColor;
        }
        canvasContext.fillRect(
          i,
          canvasHeight / 2 - sampleValue / 2,
          w,
          sampleValue,
        );
      }
    },
    [audioBuffer, currentTime, totalDuration],
  );

  function play() {
    audio?.play();
  }

  function pause() {
    audio?.pause();
  }

  return (
    <div className="p-5">
      <div className="relative">
        <audio className="hidden" controls ref={audioRef}>
          <source src={url} />
        </audio>
        {!!audioBuffer && <canvas ref={canvasRef} />}
        <input
          type="range"
          className="w-full h-[70px] absolute top-0 left-0 opacity-0"
          onChange={(e) => (audio!.currentTime = Number(e.target.value))}
          min="0"
          max={totalDuration}
          value={currentTime}
        />
      </div>
      <div className="text-center">
        {timeFormat(currentTime)}/{timeFormat(totalDuration)}
      </div>
      <div className="flex justify-center">
        {audio?.paused ? (
          <Button onClick={play}>
            <Play />
          </Button>
        ) : (
          <Button onClick={pause}>
            <Pause />
          </Button>
        )}
      </div>
    </div>
  );
}

function drawBlankPlayback({
  canvasContext,
  canvasHeight,
  canvasWidth,
  splitPoint,
}: {
  canvasContext: CanvasRenderingContext2D;
  canvasHeight: number;
  canvasWidth: number;
  splitPoint: number;
}) {
  canvasContext.beginPath();
  canvasContext.moveTo(0, canvasHeight / 2);

  canvasContext.lineTo(splitPoint, canvasHeight / 2);
  canvasContext.closePath();
  canvasContext.strokeStyle = activeColor;
  canvasContext.stroke();
  canvasContext.beginPath();
  canvasContext.moveTo(splitPoint, canvasHeight / 2);
  canvasContext.lineTo(canvasWidth, canvasHeight / 2);
  canvasContext.strokeStyle = inactiveColor;
  canvasContext.stroke();
}

function timeFormat(seconds: number): string {
  seconds = Math.floor(seconds);

  const s = seconds % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);

  if (!!h)
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function Button({
  children,
  onClick,
}: {
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  );
}
