const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 200, y: 200, size: 20 };

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') player.y -= 5;
  if (e.key === 'ArrowDown') player.y += 5;
  if (e.key === 'ArrowLeft') player.x -= 5;
  if (e.key === 'ArrowRight') player.x += 5;
  draw();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

draw();
