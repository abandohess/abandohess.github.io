// CAPTURE THE SOUND
// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes
var audioCtx;
var source;
var stream;
var dataArrayAlt;
var analyser;

// Start the visualizer on click of buttons
document.getElementById("start-vis").onclick = function () {
  document.getElementById("start-vis").style.display = "none";

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioCtx.resume();

  document.getElementById("change-view").style.display = "block";

  startVisualizer();
}

function startVisualizer() {
  // set up the different audio nodes we will use for the app
  analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;

  // main block for doing the audio recording
  if (navigator.mediaDevices.getUserMedia) {
     var constraints = { audio: true }
     navigator.mediaDevices.getUserMedia(constraints)
        .then(
          function(stream) {
             source = audioCtx.createMediaStreamSource(stream);
             source.connect(analyser);
             analyser.fftSize = 256;
             var bufferLengthAlt = analyser.frequencyBinCount;
             dataArrayAlt = new Uint8Array(bufferLengthAlt);
             analyser.getByteFrequencyData(dataArrayAlt);
        })
        .catch( function(err) {
          console.log('The following getUserMedia error occured: ' + err);
        });
  } else {
          console.log('getUserMedia not supported on your browser!');
  }
}
