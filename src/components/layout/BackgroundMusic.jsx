import { useEffect, useRef } from 'react';
import { fadeIn, fadeOutAndPause } from '../../utils/audio';

export default function BackgroundMusic({ enabled = false, volume = 0.15, loop = true }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.loop = loop;
      audioRef.current.volume = 0;
      audioRef.current.preload = 'auto';
    }

    if (enabled) {
      if (audioRef.current.src || audioRef.current.readyState > 0) {
        audioRef.current.play().catch(err => {
          if (import.meta.env.DEV) {
            console.warn('Cannot play background music (user interaction required):', err);
          }
        });
        fadeIn(audioRef.current, volume);
      } else if (import.meta.env.DEV) {
        console.info('Background music: No audio file loaded. Add file to public/assets/background-music.mp3');
      }
    } else if (audioRef.current) {
      fadeOutAndPause(audioRef.current);
    }

    return () => {
      if (audioRef.current) {
        fadeOutAndPause(audioRef.current);
      }
    };
  }, [enabled, volume, loop]);

  return null;
}

