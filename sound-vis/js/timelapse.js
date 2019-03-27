// CAPTURE THE SOUND
// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// gather data every .1 seconds for the time lapse view
setInterval(function(){
  if (dataArrayAlt != null && view === 1 && timeLapse.length <= particleSystems.length) {
    analyser.getByteFrequencyData(dataArrayAlt);

    let volumeRatio = getVolumeRatio(dataArrayAlt);
    let height = MIN_RADIUS + volumeRatio * (MAX_RADIUS - MIN_RADIUS);
    let color = getRGB(dataArrayAlt);

    timeLapse.push({height: height, color: color});
    // console.log(timeLapse.length, particleSystems.length)
  }
}, 100);


var BIN_FREQ_SIZE = 44100.0 / 256;

var particleSystems = [];

// create a WebGL timelapseRenderer, camera and a scene
var timelapseRenderer = new THREE.WebGLRenderer();
var timelapseCamera = new THREE.Camera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var timelapseScene = new THREE.Scene();

initParticleSystems();

function getMaxFrequency(array, max) {
  let new_max = max;
  for (let i = 0; i < timelapseAnalyser.fftSize / 2; i++) {
    if (array[i] > 50) {
      if (i * BIN_FREQ_SIZE > new_max) {
      }
      new_max = Math.max(new_max, i * BIN_FREQ_SIZE);
    }
  }
  return new_max;
}

function clearParicleSystems() {
  particleSystems = [];
  timeLapse = [];
}

function initParticleSystems() {
  clearParicleSystems();
  timelapseScene = new THREE.Scene();
  for (let systemNum = 0; systemNum < 1800; systemNum++) {
    let systemParticles = new THREE.Geometry();
    for (let i = 0; i < 800; i++) {
      let particle = new THREE.Vertex( new THREE.Vector3(0, 0, 0) );
      systemParticles.vertices.push(particle);
    }
    let systemMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 4
    });
    let particleSystemm = new THREE.ParticleSystem(
      systemParticles,
      systemMaterial);
    particleSystems.push(particleSystemm);
    timelapseScene.addChild(particleSystemm);
  }
}

// @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (
  function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
  }
)();

// the camera starts at 0,0,0 so pull it backs
timelapseCamera.position.z = 1000;

// start the timelapseRenderer - set the clear color to full black
timelapseRenderer.setClearColor(new THREE.Color(0, 1));
timelapseRenderer.setSize(WIDTH, HEIGHT);


// attach the render-supplied DOM element
var $container2 = $('#container2');
$container2.append(timelapseRenderer.domElement);


var oldSize = 0;

var maxFreq = 0;

// animation loop
function timelapseUpdate() {
  // if we have collected at least one data point
  if (timeLapse.length > 0) {
    // if we should display a new data point (data point being a bar in the timelapse)
    if (oldSize != timeLapse.length) {

      // if we care about the max frequency, uncomment out
      // maxFreq = getMaxFrequency(dataArrayAlt, maxFreq);

      oldSize = timeLapse.length;

      let numColumns = timeLapse.length;
      let currXPos = 0; // used to place a column
      let xStep = window.innerWidth / numColumns; // how much space should be between each column in the timelapse
      for (let i = 0; i < numColumns && i < particleSystems.length; i++) {

        let heightColor = timeLapse[i];
        let currYPos = 0; // place of particle in particle column (bar)
        let yStep = heightColor.height / 100; // y distance between particles in bar
        let system = particleSystems[i];

        system.materials[0].color = new THREE.Color(heightColor.color);

        // place 100 particles in particle column
        for (let j = 0; j < 100; j+=1) {
          let particle = system.geometry.vertices[j];
          particle.position.x = currXPos + (Math.random() * 5) - window.innerWidth / 2;
          particle.position.y = currYPos+ (Math.random() * 5) - 200;
          currYPos = currYPos + yStep;
        }

        // flag to the particle system that we've
        // changed its vertices. This is the
        // dirty little secret.
        system.geometry.__dirtyVertices = true;
        currXPos = currXPos + xStep;
      }
    }
  }

  timelapseRenderer.render(timelapseScene, timelapseCamera);

  // set up the next call
  requestAnimFrame(timelapseUpdate);
}

// start recursion to show scene
requestAnimFrame(timelapseUpdate);
