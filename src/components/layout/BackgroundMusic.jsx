import { useEffect, useRef, useState } from 'react';
import { fadeIn, fadeOutAndPause } from '../../utils/audio';

export default function BackgroundMusic({ 
  enabled = false, 
  volume = 0.3, 
  loop = true
}) {
  const audioRef = useRef(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/audio/background.mp3');
      audioRef.current.loop = loop;
      audioRef.current.volume = 0;
      audioRef.current.preload = 'auto';
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('File path: /assets/audio/background.mp3');
      });

      audioRef.current.addEventListener('loadeddata', () => {
        if (import.meta.env.DEV) {
          console.log('Audio loaded successfully');
        }
      });
    }

    const unlockAndPlay = () => {
      if (!userInteractedRef.current) {
        userInteractedRef.current = true;
        
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            if (import.meta.env.DEV) {
              console.log('Audio unlocked and playing');
            }
            if (enabled) {
              fadeIn(audioRef.current, volume);
            }
          }).catch((err) => {
            console.error('Cannot play audio:', err);
          });
        }
      }
    };

    if (enabled) {
      if (userInteractedRef.current) {
        if (audioRef.current.readyState >= 2) {
          audioRef.current.play().catch((err) => {
            console.error('Play error:', err);
          });
          fadeIn(audioRef.current, volume);
        } else {
          const handleCanPlay = () => {
            audioRef.current.play().catch((err) => {
              console.error('Play error:', err);
            });
            fadeIn(audioRef.current, volume);
          };
          audioRef.current.addEventListener('canplaythrough', handleCanPlay, { once: true });
        }
      } else {
        document.addEventListener('click', unlockAndPlay, { once: true });
        document.addEventListener('touchstart', unlockAndPlay, { once: true });
        document.addEventListener('keydown', unlockAndPlay, { once: true });
      }
    } else if (!enabled && audioRef.current) {
      fadeOutAndPause(audioRef.current);
    }

    return () => {
      document.removeEventListener('click', unlockAndPlay);
      document.removeEventListener('touchstart', unlockAndPlay);
      document.removeEventListener('keydown', unlockAndPlay);
    };
  }, [enabled, volume, loop]);

  return null;
}
