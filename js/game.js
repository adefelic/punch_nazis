var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.y = 74;
camera.position.z = 73;
//camera.position.x = 50
//camera.position.y = 50;
//camera.position.z = 200;

// world
var world_geometry = new THREE.SphereGeometry(100, 32, 32);
var loader = new THREE.TextureLoader();
var world_tex = loader.load(
	'textures/patchygrass_1.jpg'
);
var world_material = new THREE.MeshBasicMaterial( { color: 0x777733, map: world_tex } );
var world_mesh = new THREE.Mesh(world_geometry, world_material);
scene.add(world_mesh);
world_mesh.rotation.z = 1.0;

var sky_geometry = new THREE.PlaneGeometry(300,300);
var sky_material = new THREE.MeshBasicMaterial( {color: 0x7ec0ee} );
var sky_box = new THREE.Mesh( sky_geometry, sky_material );
scene.add( sky_box );

//sky_box.position.z = 150;

function render() {
	requestAnimationFrame(render);
	world_mesh.rotation.x += 0.004;
	renderer.render(scene, camera);
}
render();