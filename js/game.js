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
var render_order = Number.MAX_SAFE_INTEGER; // this is a hack
var actor_materials = [];
var misses = 0;
var hits = 0;

init();
animate();

function init() {

	// Scene
	scene = new THREE.Scene();

	// Camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .4, 300);
	camera.position.x = 0;
	camera.position.y = 97.6;
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
	// it would be fun to give different ones different behaviors
	var actor_tex1 = loader.load('textures/nazi1a.png');
	var actor_tex2 = loader.load('textures/nazi1b.png');
	var actor_tex3 = loader.load('textures/nazi2a.png');
	var actor_tex4 = loader.load('textures/nazi2b.png');
	actor_materials.push(new THREE.MeshBasicMaterial( { map: actor_tex1, transparent: true, depthWrite: false, side: THREE.DoubleSide } ));
	actor_materials.push(new THREE.MeshBasicMaterial( { map: actor_tex2, transparent: true, depthWrite: false, side: THREE.DoubleSide } ));
	actor_materials.push(new THREE.MeshBasicMaterial( { map: actor_tex3, transparent: true, depthWrite: false, side: THREE.DoubleSide } ));
	actor_materials.push(new THREE.MeshBasicMaterial( { map: actor_tex4, transparent: true, depthWrite: false, side: THREE.DoubleSide } ));
}

function newActor() {
	actors.push(
		new Actor(
			new THREE.Mesh(
				new THREE.PlaneGeometry(1, 1),
				actor_materials[Math.floor((Math.random() * 4))]
			), 
		render_order--, scene));
	if (render_order == 0) render_order = Number.MAX_SAFE_INTEGER;
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

		// punch left
		// punch center
		// punch right
		/*
		if (actors[i].mesh.rotation.x >= .22 && ) {
			actors[i].remove();
			delete actors[i];
			actors.splice(i, 1);
		}
		*/
		// if the character has moved past the near plane, deallocate them
		if (actors[i].mesh.rotation.x >= .3) {
			misses++; // tally a miss
			actors[i].remove();
			delete actors[i];
			actors.splice(i, 1);
		}

		//displays hits / misses
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

