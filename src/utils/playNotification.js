const playNotificationSound = () => {
  const audio = new Audio('/notification sound.mp3'); // Ensure file is inside the public folder
  
  // Retrieve and parse the sound setting from localStorage
  const soundEnabled = JSON.parse(localStorage.getItem('notificationSoundEnabled'));

  if (soundEnabled) {
    audio.play();
  }
};

export default playNotificationSound;