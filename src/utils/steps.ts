export interface Step {
  text: string;
  timerSeconds?: number;
}

/** Strips the one markdown construct steps use (**bold**) for plain-text contexts like JSON-LD. */
export function stepPlainText(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escapes a step's text then renders its **bold** markers as <strong>, for display via set:html. */
export function renderStepHtml(text: string): string {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Formats a timer duration for display, e.g. 900 -> "15 min", 3600 -> "1 h", 5400 -> "1 h 30 min". */
export function formatTimerDuration(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}
