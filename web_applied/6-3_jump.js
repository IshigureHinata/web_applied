const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;

// キャラ：位置（左上）・大きさ・縦の速さ vy（下が＋）
const player = { x: 80, y: 20, w: 32, h: 32, vy: 0, isGrounded: false };
const floor = { x: 0, y: 320, w: 640, h: 40 };

// キーの処理
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  // 地面にいる、かつスペースを押したときだけ跳ぶ
  if (e.code === "Space" && player.isGrounded) {
    player.vy = -JUMP_SPEED;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 床とぶつかったら、位置を戻して、速さを決める
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
  } else {
    player.isGrounded = false;
  }
}

function update(dt) {
  if (keys["ArrowRight"]) {
    player.x = player.x + MOVE_SPEED * dt;
  }
  if (keys["ArrowLeft"]) {
    player.x = player.x - MOVE_SPEED * dt;
  }

  player.vy = player.vy + GRAVITY * dt;
  player.y = player.y + player.vy * dt;
  collideWithFloor();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);

  // 地面にいるときは水色、空中にいるときは黄色（三項演算子）
  ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   isGrounded = " + player.isGrounded, 10, 20);
}

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);