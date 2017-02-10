/*
 * nazi punching game
 * Author: Adam DeFelice
 * Date: February 2017
 */

// some globals
var scene, camera, renderer;
var clock = new THREE.Clock();

// my globals below here
var loader = new THREE.TextureLoader();
var world_mesh;
var actors = [];
var render_order = 1000; // this is a hack
var actor_material1, actor_material2;

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

	// Renderer
	renderer = new THREE.WebGLRenderer();
	//renderer.sortObjects = false;
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
	var world_tex = loader.load('textures/patchygrass_1.jpg');
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
	scene.add(sky_mesh);

	// Actor meshes
	var actor_tex1 = loader.load('textures/nazi1a.png');
	actor_material1 = new THREE.MeshBasicMaterial( { map: actor_tex1, transparent: true, depthWrite: false } );
	var actor_tex2 = loader.load('textures/nazi2a.png'); 
	actor_material2 = new THREE.MeshBasicMaterial( { map: actor_tex2, transparent: true, depthWrite: false } );
}

function newActor() {
	var material;
	// i should make different types behave differently
	if (Math.random() < .5) {
		// tall
		material = actor_material1;
	} else {
		// short
		material = actor_material2;
	}
	actors.push(new Actor(new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.6), material), render_order--, scene));
	if (render_order == 0) render_order = 1000;
}

function animate() {
	requestAnimationFrame(animate);
	render();
	update();
}

function update() {
	var time = Date.now();

	// compare # of scene children w/ # of manually tracked actors
	console.log(scene.children.length, actors.length);

	// generate new Actors
	if (time % 5 == 0) newActor();

	// spin the world
	world_mesh.rotation.x += 0.001;

	// handle individual Actors
	for (var i = actors.length - 1; i >= 0; i--) {

		actors[i].update();

		// pseudorandomly change character lateral speed
		if (time % 10+i == 0) {
			actors[i].updateSpeed();
		}

		// if character hits a side boundary, reverse direction
		if (Math.abs(actors[i].mesh.rotation.z) > .01) {
			actors[i].lateralSpeed *= -1;
		}

		// if the character has moved past the near plane, deallocate them
		if (actors[i].mesh.rotation.x >= .3) {
			actors[i].remove();
			delete actors[i];
			actors.splice(i, 1);
		}
	}
}

// stole this from an example
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
	renderer.render(scene, camera);
}

