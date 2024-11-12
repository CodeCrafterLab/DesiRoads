// Get the canvas and set up the context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game variables
let carX = canvas.width / 2 - 20;
let carY = canvas.height - 100;
const carWidth = 40;
const carHeight = 70;
const roadWidth = 200;
const laneWidth = roadWidth / 2;
const roadSpeed = 5;
let roadOffset = 0;

// Controls
let controls = {
  left: false,
  right: false,
};

// Scenery objects
let trees = [];
let mountains = [];

// Event listeners for controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') controls.left = true;
  if (e.key === 'ArrowRight') controls.right = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') controls.left = false;
  if (e.key === 'ArrowRight') controls.right = false;
});

// Create trees and mountains randomly
function generateScenery() {
  if (Math.random() < 0.05) {
    trees.push({ x: Math.random() * (canvas.width - roadWidth) + roadWidth / 2, y: -50 });
  }
  if (Math.random() < 0.02) {
    mountains.push({ x: Math.random() < 0.5 ? 50 : canvas.width - 150, y: -100 });
  }
}

// Draw road
function drawRoad() {
  ctx.fillStyle = "#555"; // Gray road
  const roadX = canvas.width / 2 - roadWidth / 2;
  ctx.fillRect(roadX, 0, roadWidth, canvas.height);

  // Draw center line
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 5;
  ctx.setLineDash([20, 20]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, roadOffset % 40 - 40);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Draw scenery
function drawScenery() {
  ctx.fillStyle = "green";
  trees.forEach((tree) => {
    ctx.beginPath();
    ctx.arc(tree.x, tree.y, 10, 0, Math.PI * 2);
    ctx.fill();
    tree.y += roadSpeed - 1; // Move tree down
  });
  trees = trees.filter(tree => tree.y < canvas.height); // Remove trees out of view

  ctx.fillStyle = "#8B4513"; // Brown color for mountains
  mountains.forEach((mountain) => {
    ctx.beginPath();
    ctx.moveTo(mountain.x, mountain.y);
    ctx.lineTo(mountain.x + 100, mountain.y);
    ctx.lineTo(mountain.x + 50, mountain.y - 50);
    ctx.closePath();
    ctx.fill();
    mountain.y += roadSpeed - 2; // Move mountain down
  });
  mountains = mountains.filter(mountain => mountain.y < canvas.height); // Remove mountains out of view
}

// Draw car
function drawCar() {
  ctx.fillStyle = "red";
  ctx.fillRect(carX, carY, carWidth, carHeight);
}

// Update car position
function updateCar() {
  const roadX = canvas.width / 2 - roadWidth / 2;
  if (controls.left && carX > roadX) {
    carX -= 5;
  }
  if (controls.right && carX < roadX + roadWidth - carWidth) {
    carX += 5;
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  roadOffset += roadSpeed;
  drawRoad();
  generateScenery();
  drawScenery();
  updateCar();
  drawCar();

  requestAnimationFrame(gameLoop);
}

gameLoop();
