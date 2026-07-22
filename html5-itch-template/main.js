import { assets } from './assetManager.js';
import { sounds } from './soundManager.js';

// --- Game Configuration & State ---
const GAME_WIDTH = 800;   // Internal base logical width
const GAME_HEIGHT = 600;  // Internal base logical height

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let scaleFactor = 1;
let isLoaded = false;

// --- Auto-fit Canvas to itch.io iFrame ---
function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Maintain aspect ratio
  scaleFactor = Math.min(windowWidth / GAME_WIDTH, windowHeight / GAME_HEIGHT);

  canvas.width = GAME_WIDTH * scaleFactor;
  canvas.height = GAME_HEIGHT * scaleFactor;

  // Preserve scale transform across frame renders
  ctx.imageSmoothingEnabled = false; 
}

window.addEventListener('resize', resize);
resize(); // Initial setup

// Initialize Web Audio on first user interaction (itch.io iframe click)
function unlockAudio() {
  sounds.init();
  window.removeEventListener('click', unlockAudio);
  window.removeEventListener('keydown', unlockAudio);
  window.removeEventListener('touchstart', unlockAudio);
}

window.addEventListener('click', unlockAudio);
window.addEventListener('keydown', unlockAudio);
window.addEventListener('touchstart', unlockAudio);

// Boot sequence: Preload assets first, then start loop
async function boot() {
  try {
    // Queue images and sound files here as needed:
    // await Promise.all([
    //   assets.loadImage('player', 'assets/player.png'),
    //   sounds.loadSound('jump', 'assets/jump.wav')
    // ]);

    isLoaded = true;
    requestAnimationFrame(gameLoop);
  } catch (err) {
    console.error('Asset loading failed:', err);
  }
}

let lastTime = 0;
function gameLoop(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  // Game logic updates go here
}

function render() {
  // Clear screen
  ctx.fillStyle = '#11111d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!isLoaded) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Loading: ${Math.round(assets.getProgress() * 100)}%`, 20, 40);
    return;
  }

  // Draw scaled content
  ctx.save();
  ctx.scale(scaleFactor, scaleFactor);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px sans-serif';
  ctx.fillText('Ready for development...', 20, 40);

  ctx.restore();
}

// Start preloader
boot();
