const recorderContainer = document.getElementById("jsRecord-container");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = event => {
  console.log(event);
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.mp4";
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", startRecoding);
  recordBtn.addEventListener("click", getRecording);
  recordBtn.innerHTML = "Start Recording";
};

const startRecoding = () => {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailabe", handleVideoData);
  recordBtn.addEventListener("click", stopRecording);
};

const getRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
      video: { width: 1280, height: 720 }
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordBtn.innerHTML = "Stop Recording";
    streamObject = stream;
    startRecoding(stream);
  } catch (error) {
    recordBtn.innerHTML = "Can't record";
  } finally {
    recordBtn.removeEventListener("click", getRecording);
  }
};

const init = () => {
  recordBtn.addEventListener("click", getRecording);
};

if (recorderContainer) {
  init();
}
