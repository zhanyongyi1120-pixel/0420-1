let capture;
let pg; // 宣告圖層變數
let bubbles = []; // 儲存泡泡物件的陣列

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏原始 HTML 影片元件，只顯示在 canvas 上
  capture.hide();
  // 建立一個初始大小的圖層
  pg = createGraphics(width * 0.6, height * 0.6);

  // 初始化泡泡
  for (let i = 0; i < 20; i++) {
    bubbles.push({
      x: random(width * 0.6),
      y: random(height * 0.6),
      size: random(10, 40),
      speed: random(1, 3),
      isBursting: false,
      burstScale: 1,
      alpha: 150
    });
  }
}

function draw() {
  background('#e7c6ff');
  
  // 計算影像寬高（全螢幕的 60%）
  let vW = width * 0.6;
  let vH = height * 0.6;

  // 計算居中對齊的起始位置
  let x = (width - vW) / 2;
  let y = (height - vH) / 2;

  // 確保 pg 的尺寸與顯示的視訊一致
  if (pg.width !== floor(vW) || pg.height !== floor(vH)) {
    pg.resizeCanvas(vW, vH);
  }
  
  pg.clear(); // 清除圖層，確保背景透明，只保留泡泡

  // --- 泡泡處理與繪製邏輯 ---
  for (let b of bubbles) {
    if (!b.isBursting) {
      // 正常漂浮邏輯
      b.y -= b.speed;
      b.x += sin(frameCount * 0.05 + b.size) * 0.5; // 輕微左右晃動
      
      // 隨機爆破機率或飄出邊界重置
      if (random(1) < 0.005 || b.y < -b.size) {
        if (b.y < -b.size) {
          resetBubble(b, vW, vH);
        } else {
          b.isBursting = true;
        }
      }

      // 繪製透明泡泡
      pg.stroke(255, 200);
      pg.strokeWeight(1);
      pg.fill(255, 255, 255, 50);
      pg.circle(b.x, b.y, b.size);
      
      // 泡泡反光點
      pg.noStroke();
      pg.fill(255, 255, 255, 180);
      pg.circle(b.x - b.size * 0.2, b.y - b.size * 0.2, b.size * 0.15);
    } else {
      // 爆破動畫邏輯
      b.burstScale += 0.2;
      b.alpha -= 15;
      
      pg.noFill();
      pg.stroke(255, b.alpha);
      pg.strokeWeight(2);
      pg.circle(b.x, b.y, b.size * b.burstScale);
      
      // 動態結束後重置泡泡位置
      if (b.alpha <= 0) {
        resetBubble(b, vW, vH);
      }
    }
  }

  // --- 視訊與圖層渲染（鏡像處理） ---
  push();
  // 將座標系移動到影像區域的右側邊界，然後水平縮放 -1 倍實作鏡像
  translate(x + vW, y);
  scale(-1, 1);

  // 在反轉後的座標系中繪製視訊影像
  image(capture, 0, 0, vW, vH);
  // 將畫有泡泡的 pg 圖層疊加在視訊上方
  image(pg, 0, 0);
  pop();
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布尺寸
  resizeCanvas(windowWidth, windowHeight);
}

// 重置泡泡狀態的輔助函式
function resetBubble(b, vW, vH) {
  b.x = random(vW);
  b.y = vH + random(20, 100);
  b.size = random(10, 40);
  b.isBursting = false;
  b.burstScale = 1;
  b.alpha = 150;
}