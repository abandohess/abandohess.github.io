// CAPTURE THE SOUND
// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

//set up the different audio nodes we will use for the app
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

//main block for doing the audio recording
var dataArrayAlt;
if (navigator.mediaDevices.getUserMedia) {
   var constraints = { audio: true }
   navigator.mediaDevices.getUserMedia (constraints)
      .then(
        function(stream) {
           source = audioCtx.createMediaStreamSource(stream);
           source.connect(analyser);
//            analyser.connect(gainNode);
//            gainNode.connect(audioCtx.destination);
//            analyser.connect(audioCtx.destination);
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
