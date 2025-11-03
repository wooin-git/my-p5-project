let vid;
let vidWidth, vidHeight;
let scaleFactor = 1.2;
let frozenAreas = [];
let texts = [
  "coffee overdose", "night scroll", "home concert", "soft burnout", 
  "lost socks", "lost file", "unbox day", "budget cry", 
  "mosquito hunt", "solo queue"
];

let forward = true; // 영상 진행 방향
let speed = 0.8; // 재생 속도 (프레임 단위)

function preload() {
  vid = createVideo('apt2.mp4');
  vid.hide();
}

function setup() {
  vid.elt.onloadedmetadata = () => {
    vidWidth = vid.elt.videoWidth;
    vidHeight = vid.elt.videoHeight;
    createCanvas(vidWidth * scaleFactor, vidHeight * scaleFactor);
    vid.time(0);
    frameRate(30);
    textAlign(CENTER, TOP);
    textSize(16);
    fill(255);
  };
}

function draw() {
  if (!vidWidth || !vidHeight) return;

  // 부메랑 재생
  let t = vid.time();
  if (forward) {
    t += deltaTime / 1000 * speed;
    if (t >= vid.duration()) {
      t = vid.duration();
      forward = false;
    }
  } else {
    t -= deltaTime / 1000 * speed;
    if (t <= 0) {
      t = 0;
      forward = true;
    }
  }
  vid.time(t);

  image(vid, 0, 0, width, height);

  // 저장된 멈춘 영역 표시
  for (let area of frozenAreas) {
    image(area.img, area.x, area.y, area.size, area.size);
    text(area.text, area.x + area.size / 2, area.y + area.size + 5);
  }
}

function mousePressed() {
  freezeFrame(mouseX, mouseY);
  return false;
}

function touchStarted() {
  for (let t of touches) {
    freezeFrame(t.x, t.y);
  }
  return false;
}

function freezeFrame(x, y) {
  vid.loadPixels();
  let size = int(random(50, 150));
  let sx = int(map(x, 0, width, 0, vidWidth) - size / 2 / scaleFactor);
  let sy = int(map(y, 0, height, 0, vidHeight) - size / 2 / scaleFactor);

  let frozenImg = createImage(size, size);
  frozenImg.loadPixels();

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      let px = constrain(sx + i, 0, vidWidth - 1);
      let py = constrain(sy + j, 0, vidHeight - 1);
      let idx = (py * vid*
