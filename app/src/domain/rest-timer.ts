import { z } from "zod";
export const restStateSchema = z.object({
  source: z.string().max(150),
  duration: z.number().int().min(15).max(1800),
  deadline: z.number().finite().min(0).nullable(),
  pausedSeconds: z.number().int().min(0).max(1800).nullable(),
  stopped: z.boolean(),
});
export type RestState = z.infer<typeof restStateSchema>;
export function remainingRest(state: RestState, now: number) {
  if (state.stopped) return 0;
  if (state.deadline === null) return state.pausedSeconds ?? state.duration;
  return Math.min(
    state.duration,
    Math.max(0, Math.ceil((state.deadline - now) / 1000)),
  );
}
export function startRest(
  source: string,
  duration: number,
  at: number,
): RestState {
  return {
    source,
    duration,
    deadline: at + duration * 1000,
    pausedSeconds: null,
    stopped: false,
  };
}
export function pauseRest(state: RestState, now: number): RestState {
  return { ...state, deadline: null, pausedSeconds: remainingRest(state, now) };
}
export function resumeRest(state: RestState, now: number): RestState {
  return {
    ...state,
    deadline: now + remainingRest(state, now) * 1000,
    pausedSeconds: null,
    stopped: false,
  };
}
export function restLabel(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
