import "./App.css";
// import { tiles, cardClick } from "./test";
import React, { useEffect, useRef } from "react";
import {
  Engine,
  RectangleEntity,
  CircleEntity,
  ShapeCircle,
  BodyStatic,
  BodyDynamic,
} from "./Tiny2D";
import tableImg from "./billiard.png";

function App() {
  //billiard部分

  let engine;
  let target;
  let mousePos = null;

  const walls = [
    [-100, -100, 1000, 140],
    [-100, 410, 1000, 100],
    [-100, -100, 140, 650],
    [760, -100, 100, 650],
  ];

  const holes = [
    [35, 35],
    [400, 35],
    [765, 35],
    [35, 415],
    [400, 415],
    [765, 415],
  ];

  let balls = [
    { x: 200, y: 200, c: "#FFF400" },
    { x: 125, y: 185, c: "#005CD3" },
    { x: 150, y: 170, c: "#CE2721" },
    { x: 100, y: 200, c: "#BD4CB8" },
    { x: 175, y: 215, c: "#F06700" },
    { x: 125, y: 215, c: "#00a000" },
    { x: 175, y: 185, c: "#B70D3A" },
    { x: 150, y: 230, c: "#333333" },
    { x: 150, y: 200, c: "#FFD300" },
    { x: 650, y: 200, c: "#CAFDFF" },
  ];

  engine = new Engine(-100, -100, 1000, 650, 0, 0);
  // 壁を作成してエンジンに追加
  walls.forEach((w) => {
    let r = new RectangleEntity(w[0], w[1], w[2], w[3]);
    r.color = "gray";
    engine.entities.push(r);
  });

  // 玉を作成してエンジンに追加
  balls.forEach((b) => {
    let r = new CircleEntity(b.x, b.y, 15, BodyDynamic, 0.9, 0.99);
    r.color = b.c;
    b.entity = r;
    engine.entities.push(r);
  });

  // 穴を作成してエンジンに追加
  holes.forEach((h) => {
    let r = new CircleEntity(h[0], h[1], 20, BodyStatic);
    r.color = "rgba(255,255,255,0)";
    r.onhit = (me, peer) => {
      engine.entities = engine.entities.filter((e) => {
        return e !== peer;
      }); // 穴(me)に衝突した玉(peer)を削除
    };
    engine.entities.push(r);
  });

  const mymousedown = (e) => {
    let mouseX = !isNaN(e.offsetX) ? e.offsetX : e.touches[0].clientX;
    let mouseY = !isNaN(e.offsetY) ? e.offsetY : e.touches[0].clientY;
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].entity.isHit(mouseX, mouseY)) {
        target = balls[i].entity; // マウス座標の玉をtargetに設定
        mousePos = { x: mouseX, y: mouseY };
        break;
      }
    }
  };

  const mymousemove = (e) => {
    let mouseX = !isNaN(e.offsetX) ? e.offsetX : e.touches[0].clientX;
    let mouseY = !isNaN(e.offsetY) ? e.offsetY : e.touches[0].clientY;
    if (target) {
      mousePos = { x: mouseX, y: mouseY }; // マウスの座標を更新
    }
  };

  const mymouseup = () => {
    if (target) {
      let dx = mousePos.x - target.x;
      let dy = mousePos.y - target.y;
      target.velocity.x = dx / 10; // 玉にx方向の速度を設定
      target.velocity.y = dy / 10; // 玉にy方向の速度を設定
    }
    target = null;
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.onmousedown = mymousedown;
    canvas.onmousemove = mymousemove;
    canvas.onmouseup = mymouseup;
    canvas.addEventListener("touchstart", mymousedown);
    canvas.addEventListener("touchmove", mymousemove);
    canvas.addEventListener("touchend", mymouseup);
    // その他(Canvas, Timer)の初期化
    // ctx.font = "20pt Arial";
    // ctx.strokeStyle = "blue";

    const repaint = () => {
      const table = document.getElementById("table-img");
      ctx.drawImage(table, 0, 0, 800, 450);
      // ボール・壁の描画
      for (let i = 0; i < engine.entities.length; i++) {
        let e = engine.entities[i];
        ctx.fillStyle = e.color;
        switch (e.shape) {
          case ShapeCircle:
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            break;
        }
      }

      if (target && mousePos) {
        ctx.beginPath();
        ctx.moveTo(target.x, target.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
      }
    };
    const tick = () => {
      engine.step(0.01);
      repaint();
    };
    setInterval(tick, 50);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width="800" height="450"></canvas>
      <img src={tableImg} id="table-img" className="billiard"></img>
    </>
  );
}
export default App;
