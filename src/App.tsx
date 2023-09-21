import { FC, useState, useRef } from "react";
import cx from "clsx";
import "./App.css";

const AudioElement: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayed, setIsPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const onLoad = () => {
    const elm = audioRef.current;
    if (!elm) return;
    new Promise((resolve) => {
      elm.onloadstart = resolve;
      elm.src = "bgm.mp3";
      elm.load();
    }).then(() => {
      setIsLoaded(true);
    });
  };

  const onPlay = () => {
    const elm = audioRef.current;
    if (!elm) return;
    elm.play();
    setIsPlayed(true);
  };

  const onStop = () => {
    const elm = audioRef.current;
    if (!elm) return;
    elm.pause();
    elm.currentTime = 0;
    setIsPlayed(false);
  };

  return (
    <div className="box">
      <h2>1. AudioElement</h2>
      <button disabled={isLoaded} onClick={onLoad}>
        Load
      </button>
      &emsp;
      <button
        disabled={!isLoaded}
        onClick={onPlay}
        className={cx({ played: isPlayed })}
      >
        Play
      </button>
      &emsp;
      <button disabled={!isLoaded} onClick={onStop}>
        Stop
      </button>
      <audio ref={audioRef} />
    </div>
  );
};

const AudioBufferSourceNode: FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlayed, setIsPlayed] = useState(false);
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const audioNode = useRef<AudioBufferSourceNode | null>(null);

  const onLoad = async () => {
    if (audioContext) return;
    const ctx = new AudioContext();
    const res = await fetch("bgm.mp3");
    const arrayBuffer = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arrayBuffer);
    audioBuffer.current = buf;
    setAudioContext(ctx);
  };

  const onPlay = () => {
    if (isPlayed) {
      audioNode.current?.stop();
    }
    const track = audioBuffer.current;
    if (!audioContext || !track) return;
    const source = audioContext.createBufferSource();
    source.buffer = track;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = track.duration;
    const gainNode = audioContext.createGain();
    source.connect(gainNode).connect(audioContext.destination);
    source.start();
    setIsPlayed(true);
    audioNode.current = source;
  };

  const onStop = () => {
    const source = audioNode.current;
    if (!source) return;
    source.stop();
    setIsPlayed(false);
  };

  return (
    <div className="box">
      <h2>2. AudioBufferSourceNode</h2>
      <button disabled={!!audioContext} onClick={onLoad}>
        Load
      </button>
      &emsp;
      <button
        disabled={!audioContext}
        onClick={onPlay}
        className={cx({ played: isPlayed })}
      >
        Play
      </button>
      &emsp;
      <button disabled={!audioContext} onClick={onStop}>
        Stop
      </button>
    </div>
  );
};

const MediaElementAudioSourceNode: FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlayed, setIsPlayed] = useState(false);
  const sourceNode = useRef<MediaElementAudioSourceNode | null>(null);

  const onLoad = async () => {
    if (audioContext) return;
    const ctx = new AudioContext();
    const audio = new Audio();
    audio.src = "bgm.mp3";
    audio.loop = true;
    await new Promise<void>((resolve) => {
      audio.onloadstart = () => resolve();
      audio.load();
    });
    const source = ctx.createMediaElementSource(audio);
    const gainNode = ctx.createGain();
    source.connect(gainNode).connect(ctx.destination);
    sourceNode.current = source;
    setAudioContext(ctx);
  };

  const onPlay = () => {
    const node = sourceNode.current;
    if (!node) return;
    node.mediaElement.play();
    setIsPlayed(true);
  };

  const onStop = () => {
    const node = sourceNode.current;
    if (!node) return;
    node.mediaElement.pause();
    node.mediaElement.currentTime = 0;
    setIsPlayed(false);
  };

  return (
    <div className="box">
      <h2>3. MediaElementAudioSourceNode</h2>
      <button disabled={!!audioContext} onClick={onLoad}>
        Load
      </button>
      &emsp;
      <button
        disabled={!audioContext}
        onClick={onPlay}
        className={cx({ played: isPlayed })}
      >
        Play
      </button>
      &emsp;
      <button disabled={!audioContext} onClick={onStop}>
        Stop
      </button>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>WebAudio API DEMO</h1>

      <div style={{ display: "flex", gap: "2.5rem" }}>
        <AudioElement />
        <AudioBufferSourceNode />
        <MediaElementAudioSourceNode />
      </div>
    </div>
  );
}

export default App;
