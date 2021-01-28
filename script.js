var player;
var last_detected_state = {
  'time': 0,
  'value': []
}
var update_status_delay = 2*1000;

console.log(window.location.origin);

const video = document.getElementById('video')

const startVideo = async () => {

  try {
      video.srcObject = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
      })
  } catch (e) {
    console.log(video)
      console.error(e)
  }

}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models')
]).then(startVideo)


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
// var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '_KD1hS_nwBY',
    playerVars: {
      'mute': 0,
      'origin': window.location.origin
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({inputSize: 320, scoreThreshold: 0.8, maxResults: 1}))
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    var video_state = event.target.getPlayerState(); 
    var curr_date = Date.now();
    if(curr_date - last_detected_state.time > update_status_delay){
        // console.log(video_state)
        last_detected_state.time = curr_date;
        last_detected_state.value = detections;
        if(last_detected_state.value.length > 0 && ( video_state == -1 || video_state == 2 || video_state == 5 ) ){
          event.target.playVideo();
        }else if(last_detected_state.value.length == 0 && video_state == 1 ){
          event.target.pauseVideo();
        }
    }
    
  }, 100)
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}


