import { setInterval } from "timers";
import Axios from "axios";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayerButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const volumeRange = document.getElementById("jsVolume");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totlTime");

const handlePlayClick = () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
};

const handleVolumeClick = () => {
  if (videoPlayer.volume === 0) {
    videoPlayer.volume = 0.1;
    volumeRange.value = 0.1;
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  } else if (videoPlayer.muted) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    videoPlayer.muted = false;

    volumeRange.value = videoPlayer.volume;
    const volume = videoPlayer.volume;
    console.log(volume);
    if (volume > 0.7) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (volume > 0.4) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else if (volume >= 0.1) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeRange.value = 0;
    videoPlayer.muted = true;
  }
};

const handleDrag = event => {
  const {
    target: { value }
  } = event;

  // console.log(event.target.value);
  videoPlayer.volume = value;

  if (value > 0.7) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value > 0.4) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else if (value >= 0.1) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
};

const goFullScreen = () => {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    /* Firefox */
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    /* IE/Edge */
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
};

const exitFullScreen = () => {
  console.log("exitFullScreen");
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.removeEventListener("click", exitFullScreen);
  fullScrnBtn.addEventListener("click", goFullScreen);
};

const formatDate = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }

  return `${hours}:${minutes}:${totalSeconds}`;
};

const getCurrentTime = () => {
  currentTime.innerHTML = formatDate(videoPlayer.currentTime);
  // console.log("currentTime!!!!!!!!!!!!!!", videoPlayer.currentTime);
};

const setTotalTime = () => {
  const totalTimeString = formatDate(videoPlayer.duration);
  console.log("duration!!!!!!", videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime);
};

const handelEnded = () => {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
};

const registerView = () => {
  const videoId = window.location.href.split("/video/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST"
  });
};

const init = () => {
  videoPlayer.volume = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  volumeRange.addEventListener("input", handleDrag);
  fullScrnBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);

  if (videoPlayer.readyState >= 3) {
    setTotalTime();
  } else {
    videoPlayer.addEventListener("loadeddata", setTotalTime);
  }

  videoPlayer.addEventListener("ended", handelEnded);
};

if (videoContainer) {
  init();
}
