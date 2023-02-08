import "./App.css";
import { tiles, cardClick } from "./test";
import React, { useEffect, useRef } from "react";
import {
  Engine,
  RectangleEntity,
  LineEntity,
  CircleEntity,
  ShapeRectangle,
  ShapeCircle,
  ShapeLine,
  BodyStatic,
  BodyDynamic,
} from "./Tiny2D";

function App() {
  useEffect(() => {
    let table = document.getElementById("table");
    return () => {
      for (let i = 0; i < 4; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < 4; j++) {
          let td = document.createElement("td");
          let index = i * 4 + j;
          td.className = "tile";
          td.index = index;
          td.value = index;
          td.textContent = index === 0 ? "" : index;
          td.onclick = cardClick;
          tr.appendChild(td);
          tiles.push(td);
        }
        table.appendChild(tr);
      }
      for (let i = 0; i < 1000; i++) {
        cardClick({ target: { index: Math.floor(Math.random() * 16) } });
      }
    };
  }, []);

  let r;
  let colors = ["yellow", "pink", "green", "blue", "white", "gray"];

  const engine = new Engine(0, 0, 600, 800, 0, 9.8);
  r = new RectangleEntity(500, 50, 50, 400);
  r.color = "green";
  engine.entities.push(r);

  r = new RectangleEntity(0, 50, 50, 400);
  r.color = "yellow";
  engine.entities.push(r);

  r = new LineEntity(50, 300, 400, 350);
  r.color = "orange";
  engine.entities.push(r);

  r = new LineEntity(500, 400, 100, 450);
  r.color = "orange";
  engine.entities.push(r);

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
      r = new CircleEntity(i * 60 + 100, j * 60 + 100, 5, BodyStatic);
      r.color = colors[j];
      engine.entities.push(r);
    }
  }

  const rand = (v) => {
    return Math.floor(Math.random() * v);
  };

  for (let i = 0; i < 20; i++) {
    r = new CircleEntity(rand(400) + 50, rand(200), 10, BodyDynamic);
    r.color = colors[rand(5)];
    r.velocity.x = rand(10) - 5;
    r.velocity.y = rand(10) - 5;
    engine.entities.push(r);
  }

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const repaint = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 600, 600);
      engine.entities.forEach((e) => {
        ctx.fillStyle = e.color;
        ctx.strokeStyle = e.color;
        switch (e.shape) {
          case ShapeRectangle:
            ctx.fillRect(e.x, e.y, e.w, e.h);
            break;
          case ShapeCircle:
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            break;
          case ShapeLine:
            ctx.beginPath();
            ctx.moveTo(e.x0, e.y0);
            ctx.lineTo(e.x1, e.y1);
            ctx.stroke();
            break;
        }
      });
    };

    const tick = () => {
      engine.step(0.01);
      repaint();
    };
    setInterval(tick, 50);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width="600" height="600"></canvas>
      <table id="table"></table>
    </>
  );
}
export default App;
