let vid;
let frozenAreas = [];
let texts = [
  "coffee overdose", "night scroll", "home concert", "soft burnout", 
  "lost socks", "lost file", "unbox day", "budget cry", 
  "mosquito hunt", "solo queue"
];

let forward = true;
let speed = 0.8;
let videoReady = false;

function preload() {
  vid = createVideo('apt2.mp4');
  vid.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, TOP);
  textSize(16);
  fill(255);

  // 비디오 메타데이터 로드 후 준비
  vid.elt.onloadedmetadata = () => {
    videoReady = true;
    vid.time(0);
    frameRate(30);
  };
}

function draw() {
  background(0);

  if (!videoReady) return;

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

  // 멈춘 영역 표시
  for (let area of frozenAreas) {
    image(area.img, area.x, area.y, area.size, area.size);
    text(area.text, area.x + area.size / 2, area.y + area.size + 5);
  }
}

// 터치 또는 클릭 시 프레임 멈추기 + 비디오 재생
function mousePressed() {
  startVideoIfNeeded();
  freezeFrame(mouseX, mouseY);
  return false;
}

function touchStarted() {
  startVideoIfNeeded();
  for (let t of touches) {
    freezeFrame(t.x, t.y);
  }
  return false;
}

// 모바일 자동 재생 대응
function startVideoIfNeeded() {
  if (vid && vid.elt.paused) {
    vid.play();
    vid.volume(0); // 무음으로 자동 재생 가능
  }
}

// 프레임 멈추고 색상 반전
function freezeFrame(x, y) {
  if (!videoReady) return;

  // 20개 넘으면 초기화
  if (frozenAreas.length >= 20) {
    frozenAreas = [];
  }

  let size = int(random(50, 150));
  let sx = int(map(x, 0, width, 0, vid.width) - size / 2);
  let sy = int(map(y, 0, height, 0, vid.height) - size / 2);

  // loadPixels() 대신 get() 사용 (모바일 호환)
  let frozenImg = vid.get(sx, sy, size, size);
  frozenImg.loadPixels();

  // 색상 반전
  for (let i = 0; i < frozenImg.pixels.length; i += 4) {
    frozenImg.pixels[i + 0] = 255 - frozenImg.pixels[i + 0]; // R
    frozenImg.pixels[i + 1] = 255 - frozenImg.pixels[i + 1]; // G
    frozenImg.pixels[i + 2] = 255 - frozenImg.pixels[i + 2]; // B
  }
  frozenImg.updatePixels();

  frozenAreas.push({
    img: frozenImg,
    x: x - size / 2,
    y: y - size / 2,
    size: size,
    text: random(texts)
  });
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}