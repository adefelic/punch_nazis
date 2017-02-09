/*
 * nazi punching game
 * Author: Adam DeFelice
 * Date: February 2017
 */


// some globals
var container, scene, camera, renderer;
var clock = new THREE.Clock();

// my globals below here
var loader = new THREE.TextureLoader();
var world_mesh;
var actors = [];
var actor_speeds = [];
var render_order = 1000; // this is a hack

init();
animate();

function init() {

	// Scene
	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .4, 300);
	camera.position.x = 0;
	camera.position.y = 98.2;
	camera.position.z = 25;
	//scene.add(camera);
	//camera.position.y = 50;
	//camera.position.z = 200;

	// Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Events
	window.addEventListener( 'resize', onWindowResize, false );

	// Controls
	//

	// Floor
	var radius = 100;
	var world_geometry = new THREE.SphereGeometry(radius, 128, 128);
	loader = new THREE.TextureLoader();
	var world_tex = loader.load(
		'textures/patchygrass_1.jpg'
	);
	world_tex.wrapS = world_tex.wrapT = THREE.RepeatWrapping;
	world_tex.repeat.set( 20, 20 );
	var world_material = new THREE.MeshBasicMaterial( { color: 0x777733, map: world_tex } );
	world_mesh = new THREE.Mesh(world_geometry, world_material);
	world_mesh.rotation.z = 1.0;
	scene.add(world_mesh);

	// Sky
	var sky_geometry = new THREE.PlaneGeometry(300,300);
	var sky_material = new THREE.MeshBasicMaterial( {color: 0x7ec0ee} );
	var sky_mesh = new THREE.Mesh( sky_geometry, sky_material );
	sky_mesh.position.z = -50;
	scene.add( sky_mesh );
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
}


function newActor() {
	var actor_geometry = new THREE.PlaneGeometry(0.8,1.6);
	var actor_tex = loader.load('textures/nazi1a.png');
	var actor_material = new THREE.MeshBasicMaterial( { map: actor_tex, transparent: true, depthWrite: false } );
	var actor_mesh = new THREE.Mesh( actor_geometry, actor_material );
	// actors.push(new Actor(nazi_mesh));
	actor_mesh.renderOrder = render_order--;
	if (render_order == 0) render_order = 1000;
	actor_mesh.position.z = 0;
	actor_geometry.translate(0, 100.8, 0);
	actor_geometry.rotateZ((Math.random() - 0.5) * .1);
	actors.push( actor_mesh ); // our running collection of actors
	scene.add( actor_mesh );
	actor_speeds.push(newSpeed());
}

function newSpeed() {
	var rand = Math.random() - 0.5;
	if (Math.abs(rand) <= .06) rand = 0;
	return 0.003 * Math.pow(rand, 2);
}

function animate() {
	requestAnimationFrame(animate);
	render();
	update();
}

function update() {
	var delta = clock.getDelta();
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
	var time = Date.now();

	// handle characters
	for (var i = actors.length - 1; i >= 0; i--) {
		// pseudorandomly change character lateral motion
		if (time % 10+i == 0) {
			actor_speeds.shift();
			actor_speeds.push(newSpeed());
		}
		// if character hits a side boundary, reverse direction
		if ( Math.abs(actors[i].rotation.z) > .015 ) {
			actor_speeds[i] *= -1;
		}
		// move character laterally
		actors[i].rotation.z += actor_speeds[i];

		// if the character has moved past the near plane, deallocate them
		if (actors[i].rotation.x >= .3) {
			actors[i].material.dispose();
			actors[i].geometry.dispose();
			scene.remove(actors[i]);
		}

		// rotate characters around the world
		actors[i].rotation.x += 0.0005;
	}
	// generate new characters
	if (time % 5 == 0) newActor();

	// spin the world
	world_mesh.rotation.x += 0.001;
	
	renderer.render(scene, camera);
}

animate();

