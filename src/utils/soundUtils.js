export const playAlertSound = () => {
  const audio = new Audio("/alert.wav");
  audio.play().catch(() => {});
};
