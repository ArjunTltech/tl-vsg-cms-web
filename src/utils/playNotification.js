const playNotificationSound = () => {
    const audio = new Audio('/succuss.wav'); // File inside the public folder
    audio.play();
  };
  
  export default playNotificationSound;
  