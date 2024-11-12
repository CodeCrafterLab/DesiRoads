const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game objects
const roadWidth = canvas.width / 3;
const car = { x: canvas.width / 2 - 25, y: canvas.height - 80, width: 50, height: 100, speed: 0, maxSpeed: 5 };
const obstacles = [];
const trees = [];
const mountains = [];

// Controls
const controls = { left: false, right: false };
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") controls.left = true;
  if (e.key === "ArrowRight") controls.right = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") controls.left = false;
  if (e.key === "ArrowRight") controls.right = false;
});

// Initialize trees and mountains
for (let i = 0; i < 5; i++) {
  trees.push({ x: Math.random() * canvas.width / 2 - 100, y: Math.random() * canvas.height });
  trees.push({ x: canvas.width - Math.random() * canvas.width / 2 + 100, y: Math.random() * canvas.height });
  mountains.push({ x: Math.random() * canvas.width / 2 - 150, y: Math.random() * canvas.height });
  mountains.push({ x: canvas.width - Math.random() * canvas.width / 2 + 150, y: Math.random() * canvas.height });
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game logic
function update() {
  // Move car based on controls
  if (controls.left && car.x > canvas.width / 2 - roadWidth / 2) car.x -= car.maxSpeed;
  if (controls.right && car.x < canvas.width / 2 + roadWidth / 2 - car.width) car.x += car.maxSpeed;

  // Move obstacles and reset if off-screen
  obstacles.forEach(obstacle => {
    obstacle.y += car.maxSpeed;
    if (obstacle.y > canvas.height) {
      obstacle.y = -Math.random() * canvas.height;
      obstacle.x = canvas.width / 2 - roadWidth / 2 + Math.random() * roadWidth;
    }
  });

  // Move trees and mountains down
  trees.forEach(tree => {
    tree.y += car.maxSpeed * 0.5;
    if (tree.y > canvas.height) tree.y = -Math.random() * canvas.height;
  });
  mountains.forEach(mountain => {
    mountain.y += car.maxSpeed * 0.2;
    if (mountain.y > canvas.height) mountain.y = -Math.random() * canvas.height;
  });

  // Generate new obstacles
  if (Math.random() < 0.05) {
    obstacles.push({
      x: canvas.width / 2 - roadWidth / 2 + Math.random() * roadWidth,
      y: -100,
      width: 50,
      height: 100
    });
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw road
