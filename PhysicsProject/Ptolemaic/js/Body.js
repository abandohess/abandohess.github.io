function Body(radius, pivotMajorAxis, obliquity, eccentricity, rotationPeriod, orbitalPeriod, texture, scene) {
  this.bodyMajorAxis = .1*10.384399;
  this.bodyEccentricity = 0.0549;
  this.bodyMinorAxis = this.bodyMajorAxis*Math.sqrt(1-this.bodyEccentricity*this.bodyEccentricity);
  this.bodyTheta = 0;
  this.bodyRotationPeriod = 0.3781;
  this.bodyOrbitalPeriod = 0.074;

  this.bodyRadius = radius;
  this.obliquity = obliquity;
  this.pivotMajorAxis = pivotMajorAxis;
  this.pivotMinorAxis = pivotMajorAxis * Math.sqrt(1 - (eccentricity * eccentricity));
  this.pivotEccentricity = eccentricity;
  this.pivotTheta = 0;
  this.pivotRotationPeriod = rotationPeriod;
  this.pivotOrbitalPeriod = orbitalPeriod;

  this.material = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: new THREE.ImageUtils.loadTexture(texture) });

  this.pivotMesh = new THREE.Mesh(new THREE.SphereGeometry(.01, 32, 32), this.material);
  this.pivotMesh.position.x = pivotMajorAxis;
  this.bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(this.bodyRadius, 32, 32), this.material);
  this.bodyMesh.position.x = pivotMajorAxis + this.bodyMajorAxis;

  scene.add(this.pivotMesh);
  scene.add(this.bodyMesh);
}

Body.prototype.update = function(timeScale, timeDiff) {
  this.pivotMesh.position.x =1 /(Math.sqrt(Math.cos(this.pivotTheta)*Math.cos(this.pivotTheta)/(this.pivotMajorAxis*this.pivotMajorAxis)+ Math.sin(this.pivotTheta)*Math.sin(this.pivotTheta)/(this.pivotMinorAxis*this.pivotMinorAxis))) * Math.cos(this.pivotTheta);
	this.pivotMesh.position.z =  1 /(Math.sqrt(Math.cos(this.pivotTheta)*Math.cos(this.pivotTheta)/(this.pivotMajorAxis*this.pivotMajorAxis)+ Math.sin(this.pivotTheta)*Math.sin(this.pivotTheta)/(this.pivotMinorAxis*this.pivotMinorAxis))) * Math.sin(this.pivotTheta);
	this.bodyMesh.position.x = this.pivotMesh.position.x + 1 /(Math.sqrt(Math.cos(this.bodyTheta)*Math.cos(this.bodyTheta)/(this.bodyMajorAxis*this.bodyMajorAxis)+ Math.sin(this.bodyTheta)*Math.sin(this.bodyTheta)/(this.bodyMinorAxis*this.bodyMinorAxis))) * Math.cos(this.bodyTheta);
	this.bodyMesh.position.z =  this.pivotMesh.position.z + 1 /(Math.sqrt(Math.cos(this.bodyTheta)*Math.cos(this.bodyTheta)/(this.bodyMajorAxis*this.bodyMajorAxis)+ Math.sin(this.bodyTheta)*Math.sin(this.bodyTheta)/(this.bodyMinorAxis*this.bodyMinorAxis))) * Math.sin(this.bodyTheta);

  this.pivotTheta +=Math.PI*2/this.pivotOrbitalPeriod /365*timeScale*(timeDiff);
	this.bodyTheta     +=  Math.PI*2/    this.bodyOrbitalPeriod /365*timeScale*(timeDiff);

  this.bodyMesh.rotation.y += (2*Math.PI/this.pivotRotationPeriod*(timeDiff))* timeScale;
}
