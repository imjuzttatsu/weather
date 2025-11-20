export function fadeIn(audio, target = 0.3, step = 0.03, interval = 150) {
  audio.volume = 0;
  const timer = setInterval(() => {
    if (audio.volume < target) {
      audio.volume = Math.min(audio.volume + step, target);
    } else {
      clearInterval(timer);
    }
  }, interval);
}

export function fadeOutAndPause(audio, step = 0.03, interval = 150) {
  const timer = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(audio.volume - step, 0);
    } else {
      clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
    }
  }, interval);
}