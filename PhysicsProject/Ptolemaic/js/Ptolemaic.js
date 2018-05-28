
let renderer,scene,camera;
let cameraControls;
let far=10000;
let near = 0.001;
let cam, bgScene, bgCam	;
let sprite;

let timeScale = 1;

let scale_factor = 0.1; // Avoids Z-buffer precision problems

let earth, moon;

let sunOrbitalPeriod = 1;
let moonOrbitalPeriod = 1.5;

let sunRadius = scale_factor*1392/100;
let sunTheta = 0;
let sunMajorAxis = scale_factor*149.597;
let sunEccentricity = 0.0167;
let sunMinorAxis = sunMajorAxis*Math.sqrt(1-sunEccentricity*sunEccentricity);

let moonRadius = scale_factor*2;
let moonTheta = 0;
let moonMajorAxis = scale_factor*40.909;
let moonEccentricity = 1/360*2*Math.PI*7;
let moonObliquity = 0.205;
let moonMinorAxis = moonMajorAxis*Math.sqrt(1-moonEccentricity*moonEccentricity);

let bodies = [];

function init (){
	renderer = new THREE.WebGLRenderer();
	renderer.antialias = true;
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x000000),1.0);

	document.getElementById('container').appendChild(renderer.domElement);

	//Instancia la escena
	scene = new THREE.Scene();

	let mercuryObj = new Body(scale_factor*2.49, scale_factor*57.909, 1/360*2*Math.PI*7, 0.205, 58.64, 0.240, "textures/mercurymap.jpg", scene);
	let venusObj = new Body(scale_factor*6, scale_factor*108.208, 1/360*2*Math.PI*3.39, 0.0067, -243, 0.615, "textures/venusmap.jpg", scene);
	let marsObj = new Body(scale_factor*3.38, scale_factor*227.936, 1/360*2*Math.PI*1.85, 0.093, 1.025, 1.88, "textures/marsmap1k.jpg", scene)
	let jupiterObj = new Body(scale_factor*10, scale_factor*300.412, 1/360*2*Math.PI*1.305, 0.0483, 0.413, 2.5, "textures/jupitermap.jpg", scene)
	let saturnObj = new Body(scale_factor*9, scale_factor*450.72, 1/360*2*Math.PI*2.48, 0.0541, 0.444, 5, "textures/saturnmap.jpg", scene)

	bodies.push(mercuryObj);
	bodies.push(venusObj)
	bodies.push(marsObj)
	bodies.push(jupiterObj)
	bodies.push(saturnObj)

	let aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(/*fovy*/60, /*razon de aspecto*/aspectRatio,/*cerca*/ near,/*lejos*/far);

	// Positioning the camera
	camera.position.set(scale_factor*450,scale_factor*50,scale_factor*450);
	camera.lookAt(new THREE.Vector3(0,0,0));

	// Instanciation of the camera controls
	cameraControls = new THREE.OrbitControls(camera,renderer.domElement);

	// Orbitational center
	cameraControls.target.set(0,0,0);
	cameraControls.maxDistance = far/4;

	// Register resize callback
	window.addEventListener('resize',updateAspectRatio);

	// Lighting
	let ambientLight = new THREE.AmbientLight( 0x404040);  // Ambient light
	scene.add(ambientLight)

	sunlight = new THREE.PointLight(0xFFFFFF);
	sunlight.position.set(0,0,0);
	scene.add(sunlight);

	// Enable shadows
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

}

// Scene description
function loadScene(){
	// Load the texture cube (some fancy stars)
	let urls = ["textures/backgroundcube.png", "textures/backgroundcube.png",
	"textures/backgroundcube.png", "textures/backgroundcube.png",
	"textures/backgroundcube.png", "textures/backgroundcube.png",];

	let starMap = THREE.ImageUtils.loadTextureCube(urls);
	starMap.format = THREE.RGBFormat;
	let shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = starMap;
	let wallsMaterial = new THREE.ShaderMaterial({
		fragmentShader:shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});
	let room = new THREE.Mesh(new THREE.BoxGeometry(far,far,far),wallsMaterial);

	scene.add(room);


	let spriteMaterial = new THREE.SpriteMaterial(
	{
		map: new THREE.ImageUtils.loadTexture( 'textures/lensflare.png' ),
		useScreenCoordinates: true,
		color: 0xFFF300, transparent: true, blending: THREE.AdditiveBlending,
		scaleByViewport:true
	});
	sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(9*sunRadius, 9*sunRadius,9*sunRadius);
		scene.add(sprite); // this centers the glow at the mesh

	let texEarth = new THREE.ImageUtils.loadTexture("textures/earthmap1k.jpg");
	let materialEarth	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texEarth});
	let earthGeometry = new THREE.SphereGeometry(2, 32,32 );
	earth = new THREE.Mesh(earthGeometry, materialEarth);
	scene.add(earth);

	let texMoon = new THREE.ImageUtils.loadTexture("textures/moonmap1k.jpg");
	let materialMoon	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texMoon});
	let moonGeometry = new THREE.SphereGeometry(moonRadius, 32,32 );
	moon = new THREE.Mesh(moonGeometry, materialMoon);
	scene.add(moon);
}

let oldTime = Date.now();


function update(){
	// Camera update
	cameraControls.update();

  sprite.position.x = 1 /(Math.sqrt(Math.cos(sunTheta)*Math.cos(sunTheta)/(sunMajorAxis*sunMajorAxis)+ Math.sin(sunTheta)*Math.sin(sunTheta)/(sunMinorAxis*sunMinorAxis))) * Math.cos(sunTheta);
  sprite.position.z =  1 /(Math.sqrt(Math.cos(sunTheta)*Math.cos(sunTheta)/(sunMajorAxis*sunMajorAxis)+ Math.sin(sunTheta)*Math.sin(sunTheta)/(sunMinorAxis*sunMinorAxis))) * Math.sin(sunTheta);
	sunlight.position.x = 1 /(Math.sqrt(Math.cos(sunTheta)*Math.cos(sunTheta)/(sunMajorAxis*sunMajorAxis)+ Math.sin(sunTheta)*Math.sin(sunTheta)/(sunMinorAxis*sunMinorAxis))) * Math.cos(sunTheta);
	sunlight.position.z =  1 /(Math.sqrt(Math.cos(sunTheta)*Math.cos(sunTheta)/(sunMajorAxis*sunMajorAxis)+ Math.sin(sunTheta)*Math.sin(sunTheta)/(sunMinorAxis*sunMinorAxis))) * Math.sin(sunTheta);

	moon.position.x = 1 /(Math.sqrt(Math.cos(moonTheta)*Math.cos(moonTheta)/(moonMajorAxis*moonMajorAxis)+ Math.sin(moonTheta)*Math.sin(moonTheta)/(moonMinorAxis*moonMinorAxis))) * Math.cos(moonTheta);
	moon.position.z =  1 /(Math.sqrt(Math.cos(moonTheta)*Math.cos(moonTheta)/(moonMajorAxis*moonMajorAxis)+ Math.sin(moonTheta)*Math.sin(moonTheta)/(moonMinorAxis*moonMinorAxis))) * Math.sin(moonTheta);

  let currentTime = Date.now();

  timeScale = .01;

	sunTheta += Math.PI*2/  sunOrbitalPeriod /365*timeScale*(currentTime-oldTime);
	moonTheta += Math.PI*2/  moonOrbitalPeriod /365*timeScale*(currentTime-oldTime);

	bodies.forEach(function(body, index) {
		body.update(timeScale, currentTime - oldTime);
	});

	oldTime = currentTime;
}

function render(){
	update();
	requestAnimationFrame(render);
	renderer.render(scene,camera);

}

function updateAspectRatio(){
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

init();
loadScene();
render();
