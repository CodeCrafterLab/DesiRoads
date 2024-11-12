// Set up the basic scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Position the camera
camera.position.z = 5;
camera.position.y = 2;

// Add lighting to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// Create road
const roadWidth = 2;
const roadLength = 50;
const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // Make the road horizontal
road.position.z = -roadLength / 2;
scene.add(road);

// Create a car
const carGeometry = new THREE.BoxGeometry(0.5, 0.2, 1);
const carMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = 0.15;
scene.add(car);

// Car controls
const controls = {
  forward: false,
  backward: false,
  left: false,
  right: false
};

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': controls.forward = true; break;
    case 'ArrowDown': controls.backward = true; break;
    case 'ArrowLeft': controls.left = true; break;
    case 'ArrowRight': controls.right = true; break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp': controls.forward = false; break;
    case 'ArrowDown': controls.backward = false; break;
    case 'ArrowLeft': controls.left = false; break;
    case 'ArrowRight': controls.right = false; break;
  }
});

// Game variables
let speed = 0.05;
let carVelocity = 0;
const maxSpeed = 0.2;
const acceleration = 0.005;
const friction = 0.98;

// Animate the game
function animate() {
  requestAnimationFrame(animate);

  // Update car speed
  if (controls.forward) carVelocity = Math.min(carVelocity + acceleration, maxSpeed);
  if (controls.backward) carVelocity = Math.max(carVelocity - acceleration, -maxSpeed);
  carVelocity *= friction;

  // Update car position
  car.position.z -= carVelocity;

  // Road Reset (Endless effect)
  if (car.position.z < road.position.z + roadLength / 2) {
    car.position.z += roadLength;
  }

  // Update car steering
  if (controls.left) car.position.x -= speed;
  if (controls.right) car.position.x += speed;

  // Camera follows car
  camera.position.z = car.position.z + 5;
  camera.lookAt(car.position);

  // Render the scene
  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
