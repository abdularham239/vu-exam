import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Coffee, BookOpen } from 'lucide-react';

interface PomodoroModalProps {
  onClose: () => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({ onClose }) => {
  const { pomodoro, language } = useStudy();
  const isHinglish = language === 'hinglish';

  const [ambientAudio, setAmbientAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Toggle soft white noise / ambient focus sound
  useEffect(() => {
    if (ambientAudio) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;

        // Generate gentle brown/pink noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 0.15; // Soft volume
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(ctx.destination);
        whiteNoise.start(0);
        noiseNodeRef.current = whiteNoise;
      } catch (err) {
        console.error('Audio initialization error:', err);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch (e) {}
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    }

    return () => {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch (e) {}
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [ambientAudio]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const maxSeconds =
    pomodoro.mode === 'study'
      ? 25 * 60
      : pomodoro.mode === 'short_break'
      ? 5 * 60
      : 15 * 60;

  const progressPercent = ((maxSeconds - pomodoro.timeLeft) / maxSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {isHinglish ? 'Pomodoro Focus Timer' : 'Pomodoro Study Focus'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => pomodoro.setMode('study')}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              pomodoro.mode === 'study'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>25m Study</span>
          </button>
          <button
            onClick={() => pomodoro.setMode('short_break')}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              pomodoro.mode === 'short_break'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-500" />
            <span>5m Break</span>
          </button>
          <button
            onClick={() => pomodoro.setMode('long_break')}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              pomodoro.mode === 'long_break'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>15m Rest</span>
          </button>
        </div>

        {/* Large Timer Display */}
        <div className="py-6">
          <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {formatTime(pomodoro.timeLeft)}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-6">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Primary Timer Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={pomodoro.reset}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={pomodoro.isRunning ? pomodoro.pause : pomodoro.start}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
          >
            {pomodoro.isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>{isHinglish ? 'Rokein (Pause)' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{isHinglish ? 'Shuru Karein' : 'Start Focus'}</span>
              </>
            )}
          </button>

          {/* Ambient Noise Generator */}
          <button
            onClick={() => setAmbientAudio(!ambientAudio)}
            className={`p-3 rounded-2xl border transition-colors ${
              ambientAudio
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Focus Sound (Pink/Brown noise)"
          >
            {ambientAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Session Stats */}
        <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          {isHinglish ? (
            <span>
              Aaj ke mukammal sessions:{' '}
              <strong className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                {pomodoro.totalStudySessions}
              </strong>
            </span>
          ) : (
            <span>
              Sessions completed today:{' '}
              <strong className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                {pomodoro.totalStudySessions}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
