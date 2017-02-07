
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// camera
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.2, 1000);
	camera.position.y = 97.9;
	camera.position.z = 25;
	//camera.position.y = 50;
	//camera.position.z = 200;

	// visible world
	var radius = 100;
	var world_geometry = new THREE.SphereGeometry(radius, 128, 128);
	var loader = new THREE.TextureLoader();
	var world_tex = loader.load(
		'textures/patchygrass_1.jpg'
	);
	world_tex.wrapS = world_tex.wrapT = THREE.RepeatWrapping;
	world_tex.repeat.set( 20, 20 );
	var world_material = new THREE.MeshBasicMaterial( { color: 0x777733, map: world_tex } );
	var world_mesh = new THREE.Mesh(world_geometry, world_material);
	world_mesh.rotation.z = 1.0;
	scene.add(world_mesh);

	// sky
	var sky_geometry = new THREE.PlaneGeometry(300,300);
	var sky_material = new THREE.MeshBasicMaterial( {color: 0x7ec0ee} );
	var sky_mesh = new THREE.Mesh( sky_geometry, sky_material );
	sky_mesh.position.z = -50;
	scene.add( sky_mesh );

	// obstacles
	// might wind up not using an actual Group here so that 
	// we can handle interactions with individual obstacles
	var obstacles = [];
	var obstacle_speeds = [];
	window.addEventListener( 'resize', onWindowResize, false );//}

	var render_order = 1000;
function newCharacter() {
	var obstacle_geometry = new THREE.PlaneGeometry(0.8,1.6);
	var obstacle_tex = loader.load('textures/Guardbutt.png');
	var obstacle_material = new THREE.MeshBasicMaterial( { map: obstacle_tex, transparent: true, depthWrite: false } );
	var obstacle_mesh = new THREE.Mesh( obstacle_geometry, obstacle_material );
	obstacle_mesh.renderOrder = render_order--;
	if (render_order == 0) render_order = 1000;
	obstacle_mesh.position.z = 0;
	obstacle_geometry.translate(0, radius + 0.8, 0);
	obstacle_geometry.rotateZ((Math.random() - 0.5) * .1);
	obstacles.push( obstacle_mesh ); // our running collection of obstacles
	scene.add( obstacle_mesh );
	obstacle_speeds.push(newSpeed());
}

function newSpeed() {
	return 0.003 * Math.pow((Math.random() -.5), 2);
}

function animate() {
	requestAnimationFrame(animate);
	render();
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
	// possibly change run speed/direction
	for (var i = obstacles.length - 1; i >= 0; i--) {
		if (time % 10+i == 0) {
			obstacle_speeds.shift();
			obstacle_speeds.push(newSpeed());
		}
	}

	if (time % 5 == 0) {
		newCharacter()
	}

	// spin the world
	world_mesh.rotation.x += 0.001;
	for (var i = obstacles.length - 1; i >= 0; i--) {
		obstacles[i].rotation.x += 0.0005; // rotate around world
		if ( Math.abs(obstacles[i].rotation.z) > .015 ) {
			obstacle_speeds[i] *= -1;
		}
		obstacles[i].rotation.z += obstacle_speeds[i]; // run side to side
	}
	renderer.render(scene, camera);
}

animate();

