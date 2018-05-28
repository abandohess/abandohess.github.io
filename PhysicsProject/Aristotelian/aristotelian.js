const container = document.querySelector('#container');

const scene = new THREE.Scene();

scene.background = new THREE.Color( 0x000 );

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const FOV= 100;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

var angularSpeed = 0.1;
var lastTime = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);

container.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);

camera.position.set( 0, 0, 1000 );

let controls = new THREE.OrbitControls( camera, renderer.domElement );

controls.target.set(0,0, 0);

scene.add(camera);

const RADIUS = 200;
const WIDTH_SEGMENTS = 50;
const HEIGHT_SEGMENTS = 50;

const globe = new THREE.Group();
scene.add(globe);

var loader = new THREE.TextureLoader();

let layers = [];

loader.load('./textures/earthmap.jpg', function ( texture ) {
    //create the sphere
    var sphere = new THREE.SphereGeometry( RADIUS, WIDTH_SEGMENTS, HEIGHT_SEGMENTS )
    //map the texture to the material. Read more about materials in three.js docs
    var material = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5 } )
    //create a new mesh with sphere geometry.
    var mesh = new THREE.Mesh( sphere, material )
    //add mesh to globe group
    globe.add(mesh)
    // globe.position.z = -300;
} );

loadLayer('./textures/moonmap.jpg', 400, 30);
loadLayer('./textures/mercurymap.jpg', 500, 30);
loadLayer('./textures/venusmap.jpg', 600, 30);
loadSun('./textures/sunmap.jpg', -700, 80);
loadLayer('./textures/marsmap.jpg', 800, 30);
loadLayer('./textures/jupitermap.jpg', 1000, 80);
loadLayer('./textures/saturnmap.jpg', 1200, 60);
loadStars('./textures/nasasky.jpg', 1500)

let lightRef;
let sunRef;

function loadStars(textureURL, crystalSphereRadius) {
  loader.load(textureURL, function ( texture ) {
    let bodyGeom = new THREE.SphereGeometry( crystalSphereRadius, WIDTH_SEGMENTS, HEIGHT_SEGMENTS );
    let bodyMat = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, opacity: .5 } );
    let bodyMesh = new THREE.Mesh( bodyGeom, bodyMat );
    bodyMesh.material.side = THREE.DoubleSide;

    let layer = new THREE.Group();
    layer.add(bodyMesh);
    scene.add(layer);
    layers.push(layer);
  });
}

function loadSun(textureURL, crystalSphereRadius, bodyRadius) {
  loader.load(textureURL, function ( texture ) {
      let bodyGeom = new THREE.SphereGeometry( bodyRadius, WIDTH_SEGMENTS, HEIGHT_SEGMENTS );
      let bodyMat = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
      let bodyMesh = new THREE.Mesh( bodyGeom, bodyMat );
      bodyMesh.material.side = THREE.DoubleSide;
      bodyMesh.position.x = -crystalSphereRadius;

      let crystalSphereGeom = new THREE.SphereGeometry( crystalSphereRadius, WIDTH_SEGMENTS, HEIGHT_SEGMENTS );
      let crystalSphereMat = new THREE.MeshBasicMaterial( { color: 'rgb(189, 195, 199)', transparent: true, opacity: .05 } );
      let crystalSphereMesh = new THREE.Mesh( crystalSphereGeom, crystalSphereMat );
      crystalSphereMesh.material.side = THREE.DoubleSide;

      // var spriteMaterial = new THREE.SpriteMaterial(
      // 	{
      // 		map: loader.load( './textures/lensflare.png' ),
      // 		color: 'rgb(189, 195, 199)', blending: THREE.AdditiveBlending,
      // 	});
    	// sprite = new THREE.Sprite( spriteMaterial );
    	// sprite.scale.set(100, 100,100);
    	// scene.add(sprite);

      let layer = new THREE.Group();
      layer.add(bodyMesh);
      layer.add(crystalSphereMesh);
      // layer.position.z = -300;

      let pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = -crystalSphereRadius;
      // pointLight.position.z = -300;
      lightRef = pointLight;
      sunRef = layer;
      scene.add(pointLight);

      scene.add(layer);
      layers.push(layer);
  } );
}

function loadLayer(textureURL, crystalSphereRadius, bodyRadius) {
  loader.load(textureURL, function ( texture ) {
      let bodyGeom = new THREE.SphereGeometry( bodyRadius, WIDTH_SEGMENTS, HEIGHT_SEGMENTS );
      let bodyMat = new THREE.MeshLambertMaterial( { map: texture, overdraw: 0.5 } );
      let bodyMesh = new THREE.Mesh( bodyGeom, bodyMat );
      bodyMesh.material.side = THREE.DoubleSide;
      bodyMesh.position.x = -crystalSphereRadius;

      let crystalSphereGeom = new THREE.SphereGeometry( crystalSphereRadius, WIDTH_SEGMENTS, HEIGHT_SEGMENTS );
      let crystalSphereMat = new THREE.MeshBasicMaterial( { color: 'rgb(189, 195, 199)', transparent: true, opacity: .05 } );
      let crystalSphereMesh = new THREE.Mesh( crystalSphereGeom, crystalSphereMat );
      crystalSphereMesh.material.side = THREE.DoubleSide;

      let layer = new THREE.Group();
      layer.add(bodyMesh);
      layer.add(crystalSphereMesh);
      // layer.position.z = -300;
      scene.add(layer);
      layers.push(layer);
  } );
}

function update () {
  var time = (new Date()).getTime();
  var timeDiff = time - lastTime;
  var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
  layers.forEach(function(group, index) {
    group.rotation.y += angleChange / index;
  });
  if (lightRef && sunRef) {
    let angle = sunRef.rotation.y;
    let x = 700 *  Math.cos(angle);
    let y = 700 *  Math.sin(angle);
    lightRef.position.x = x;
    lightRef.position.z = -y;
  }
    // layers[0].rotation.x = Math.PI * 0.4;
  lastTime = time;
  // console.log(layers)
  controls.update();
  renderer.render(scene, camera)

  // Schedule the next frame:
  requestAnimationFrame(update)
}

function updateAspectRatio(){
  renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}

window.addEventListener('resize',updateAspectRatio);

// Schedule the first frame:
requestAnimationFrame(update)
