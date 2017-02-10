var Actor = function(mesh, render_order, scene) {		

	this.mesh = mesh;
	this.mesh.renderOrder = render_order;
	this.scene = scene;
	this.lateralSpeed = 0;
	
	// set initial position
	this.mesh.position.z = 0;
	this.mesh.rotation.x = .15;
	this.mesh.geometry.translate(0, 100.8, 0); // so we can rotate around the origin
	this.mesh.geometry.rotateZ((Math.random() - 0.5) * .05); // rotate laterally

	// set initial lateral movement speed
	this.updateSpeed();

	// add to scene
	this.scene.add(this.mesh);
}

Actor.prototype.updateSpeed = function() {
	var rand = Math.random() - 0.5;
	if (Math.abs(rand) <= .06) rand = 0;
	this.lateralSpeed = 0.003 * Math.pow(rand, 2);
}

Actor.prototype.update = function() {
	// rotate characters around the world
	this.mesh.rotation.x += 0.0005;
	// move character laterally
	this.mesh.rotation.z += this.lateralSpeed;
}

Actor.prototype.remove = function() {
	this.scene.remove(this.mesh);
}

