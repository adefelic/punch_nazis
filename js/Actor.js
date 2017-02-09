// adapted from http://www.96methods.com/2012/02/three-js-very-basic-animation/

var Actor = function(mesh) {

	this.mesh = mesh;
	this.render_order;
	
	// set initial lateral movement speed
	var rand = Math.random() - 0.5;
	if (Math.abs(rand) <= .06) rand = 0; 
	this.speed = 0.003 * Math.pow(rand, 2);

	this.in_scene = false;

	this.animation_cycle_duration = 1000;
	this.n_keyframes = 30;

	this.current_keyframe;
	this.last_keyframe; // previous?

	this.last_frame_rendered_flag = false;

}

Actor.prototype.load = function() {
	var loader = new THREE.TextureLoader();
	var texture = loader.load(this.sprite);
	Actor.prototype.setMesh(
		new THREE.Mesh( new THREE.PlaneGeometry(1,2), new THREE.MeshLambertMaterial( { color: 0xFF6060, map: texture } ));
	);
	this.loaded_model = true;
}

Actor.prototype.hasLoaded = function() {
	return this.loaded_model;
}

Actor.prototype.inScene = function() {
	return this.in_scene;
}

Actor.prototype.addToScene = function(scene) {
	scene.add(Actor.prototype.getMesh);
	this.in_scene = true;
}

Actor.prototype.animate = function() {
	// calculate how long to show a single frame
	var interpolation = this.animation_cycle_duration / this.n_keyframes;

	// determine current keyframe
	var time = Date.now() % this.animation_cycle_duration;
	var keyframe = Math.floor( time / interpolation ) + 1;
	if (keyframe != current_keyframe) {
		
	}
}

