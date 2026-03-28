"use client";

import { useCallback, useRef } from "react";

type SoundType = "move" | "capture" | "check" | "start" | "gameOver";

const SOUND_CONFIG: Record<SoundType, { frequency: number; duration: number; type: OscillatorType }> = {
  move:     { frequency: 440,  duration: 80,  type: "sine" },
  capture:  { frequency: 330,  duration: 120, type: "triangle" },
  check:    { frequency: 880,  duration: 200, type: "sine" },
  start:    { frequency: 528,  duration: 300, type: "sine" },
  gameOver: { frequency: 220,  duration: 400, type: "sawtooth" },
};

export function useSound(enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  }, [enabled]);

  const play = useCallback((type: SoundType) => {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const { frequency, duration, type: oscType } = SOUND_CONFIG[type];

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.type = oscType;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, [getAudioCtx]);

  return { play };
}
