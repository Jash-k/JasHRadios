import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Volume2, VolumeX, Play, Pause, Loader2, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onError?: (error: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  url,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
  onError
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const handleError = (e: any) => {
        console.error("Audio Error:", e);
        setIsLoading(false);
        setHasError(true);
        if (onError) onError("Failed to load stream");
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    if (Hls.isSupported() && url.endsWith('.m3u8')) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.ERROR, function (_, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              console.log('cannot recover');
              hls.destroy();
              setHasError(true);
              break;
          }
        }
      });
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      audio.src = url;
    } else {
      // Standard audio
      audio.src = url;
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Play error:", error);
          setHasError(true);
          onPlayPause(); // Reset play state
        });
      }
    }

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
          playPromise.catch(e => {
              console.error("Autoplay prevented or error:", e);
              // Don't set error state here as it might be user interaction policy
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
      <button
        onClick={onPlayPause}
        className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={hasError}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : hasError ? (
          <AlertCircle className="h-6 w-6" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6 fill-current" />
        ) : (
          <Play className="h-6 w-6 fill-current ml-1" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 group">
          <button
             onClick={() => onVolumeChange(volume === 0 ? 0.5 : 0)}
             className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
      
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};
