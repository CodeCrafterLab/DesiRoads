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
const roadWidth = 300; // Starting width of the road
const roadSpeed = 5;
let roadOffset = 0;
let roadCurve = 0; // Curvature variable to shift road segments
let curveDirection = 1;

// Controls
let controls = {
  left: false,
  right: false,
};

// Event listeners for controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') controls.left = true;
  if (e.key === 'ArrowRight') controls.right = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') controls.left = false;
  if (e.key === 'ArrowRight') controls.right = false;
});

// Draw road with perspective and curvature
function drawRoad() {
  const numSegments = 30; // Number of road segments
  const segmentHeight = canvas.height / numSegments;
  let roadCenter = canvas.width / 2 + roadCurve;

  // Draw each road segment from the horizon to the foreground
  for (let i = numSegments; i >= 0; i--) {
    const scale = i / numSegments; // Perspective scaling factor
    const segmentWidth = roadWidth * scale; // Width of the segment
    const segmentX = roadCenter - segmentWidth / 2;

    // Draw the road segment
    ctx.fillStyle = "#555";
    ctx.fillRect(segmentX, i * segmentHeight, segmentWidth, segmentHeight);

    // Draw the center line
    if (i % 2 === 0) { // Draw dashed lines every other segment
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(roadCenter, i * segmentHeight);
      ctx.lineTo(roadCenter, (i + 1) * segmentHeight);
      ctx.stroke();
    }

    // Adjust road curvature for the next segment
    roadCenter += curveDirection * scale * 2; // Gradual curve
  }
}

// Draw car
function drawCar() {
  ctx.fillStyle = "red";
  ctx.fillRect(carX, carY, carWidth, carHeight);
}

// Update car position
function updateCar() {
  const roadX = canvas.width / 2 + roadCurve - roadWidth / 2;
  if (controls.left && carX > roadX) {
    carX -= 5;
  }
  if (controls.right && carX < roadX + roadWidth - carWidth) {
    carX += 5;
  }
}

// Update road curvature for dynamic turns
function updateRoadCurvature() {
  roadCurve += curveDirection * 0.5;
  if (roadCurve > 100 || roadCurve < -100) {
    curveDirection *= -1; // Switch direction at max curve
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  roadOffset += roadSpeed;
  drawRoad();
  updateRoadCurvature();
  updateCar();
  drawCar();

  requestAnimationFrame(gameLoop);
}

gameLoop();
