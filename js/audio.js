const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function beep(freq, dur = 100, type = "square") {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur / 1000);
}

export function somVitoria() {
  beep(400, 100);
  setTimeout(() => beep(500, 100), 110);
  setTimeout(() => beep(650, 250), 220);
}