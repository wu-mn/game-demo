import React, { useEffect, useRef } from "react";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#FFF000";
    ctx.fillStyle = "#00FF00";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.shadowColor = "#FF0000";
    ctx.shadowBlur = 10;
    ctx.font = "46px 'Times New Roman";

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(180, 250);
    ctx.stroke();

    ctx.strokeText("aaa", 10, 50);
    ctx.fillRect(300, 100, 100, 150);
    ctx.strokeRect(500, 100, 100, 150);
  }, []);
  return (
    <>
      <canvas ref={canvasRef} width="700" height="400"></canvas>
    </>
  );
}
export default App;
