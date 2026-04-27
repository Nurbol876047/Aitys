import { Howl } from "howler";

const clamp = (value) => Math.max(-1, Math.min(1, value));

function encodeWav(samples, sampleRate) {
  const dataLength = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i += 1) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  samples.forEach((sample) => {
    view.setInt16(offset, clamp(sample) * 0x7fff, true);
    offset += 2;
  });

  let binary = "";
  const bytes = new Uint8Array(buffer);
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return `data:audio/wav;base64,${btoa(binary)}`;
}

function createWindDataUri() {
  const sampleRate = 16000;
  const duration = 2.8;
  const total = Math.floor(sampleRate * duration);
  const samples = new Float32Array(total);
  let low = 0;
  let slow = 0;

  for (let i = 0; i < total; i += 1) {
    const noise = Math.random() * 2 - 1;
    low += (noise - low) * 0.035;
    slow += (noise - slow) * 0.006;
    const pulse = Math.sin((i / sampleRate) * Math.PI * 2 * 0.18) * 0.08;
    samples[i] = (low * 0.48 + slow * 0.35 + pulse) * 0.8;
  }

  return encodeWav(samples, sampleRate);
}

export function createWindHowl() {
  return new Howl({
    src: [createWindDataUri()],
    loop: true,
    volume: 0.28,
    html5: false,
  });
}

function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith("kk")) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("tr")) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ru")) ||
    voices.find((voice) => voice.default) ||
    voices[0]
  );
}

function loadVoices() {
  if (!("speechSynthesis" in window)) return Promise.resolve([]);

  const voices = window.speechSynthesis.getVoices();
  if (voices.length) return Promise.resolve(voices);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 600);

    window.speechSynthesis.onvoiceschanged = () => {
      window.clearTimeout(timeout);
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

export async function unlockKazakhAudio(text = "Дыбыс дайын.") {
  if (!("speechSynthesis" in window)) return false;

  await loadVoices();
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();
  speakKazakh(text, { rate: 0.86, pitch: 0.96 });
  return true;
}

export function speakKazakh(text, options = {}) {
  if (!("speechSynthesis" in window)) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  const preferredVoice = getPreferredVoice();

  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.lang = preferredVoice?.lang || "kk-KZ";
  utterance.rate = options.rate || 0.88;
  utterance.pitch = options.pitch || 0.92;
  utterance.volume = options.volume || 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
  return true;
}
