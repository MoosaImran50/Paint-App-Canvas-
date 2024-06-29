import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);

  const [clicked, setClicked] = useState(false);
  const [tool, setTool] = useState("pen");
  const [prevPoint, setPrevPoint] = useState(null);
  const [memory, setMemory] = useState(null);

  function drawLine(x, y) {
    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (tool === "arrow") {
      const angle = Math.atan2(y - prevPoint.y, x - prevPoint.x);

      const arrowheadSize = 10;
      ctx.beginPath();
      ctx.moveTo(
        x - arrowheadSize * Math.cos(angle - Math.PI / 6),
        y - arrowheadSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(x, y);
      ctx.lineTo(
        x - arrowheadSize * Math.cos(angle + Math.PI / 6),
        y - arrowheadSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
  }

  function drawRectangle(x, y) {
    ctx.beginPath();
    ctx.rect(prevPoint.x, prevPoint.y, x - prevPoint.x, y - prevPoint.y);
    ctx.stroke();
  }

  function drawPen(x, y) {
    if (tool === "eraser") {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 10;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    const canvas = document.getElementById("myCanvas");
    setCanvas(canvas);
    const context = canvas.getContext("2d");
    setCtx(context);
  }, []);

  function mouseClick(evt) {
    setClicked(true);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    const x = evt.clientX;
    const y = evt.clientY;

    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();
    } else if (tool === "rectangle") {
      setPrevPoint({ x, y });
    } else if (tool === "line" || tool === "arrow") {
      setPrevPoint({ x, y });
    }

    const memoryCopy = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setMemory(memoryCopy);
  }

  function mouseMove(evt) {
    if (!clicked) {
      return;
    }

    ctx.putImageData(memory, 0, 0);

    const x = evt.clientX;
    const y = evt.clientY;

    if (tool === "pen" || tool === "eraser") {
      drawPen(x, y);
    } else if (tool === "rectangle") {
      drawRectangle(x, y);
    } else if (tool === "line" || tool === "arrow") {
      drawLine(x, y);
    }
  }

  function mouseReleaseClick() {
    setClicked(false);
  }

  return (
    <>
      <div className="mainContainer">
        <div className="drawingBoard">
          <canvas
            id="myCanvas"
            width={innerWidth}
            height={innerHeight}
            onMouseDown={mouseClick}
            onMouseMove={mouseMove}
            onMouseUp={mouseReleaseClick}
          >
            Canvas
          </canvas>
        </div>
        <div className="toolOptions">
          <div className="pen">
            <button
              onClick={() => setTool("pen")}
              style={{
                backgroundColor: tool === "pen" ? "#5034c9" : "#5e8ad1",
              }}
            >
              Pen
            </button>
          </div>
          <div className="line">
            <button
              onClick={() => setTool("line")}
              style={{
                backgroundColor: tool === "line" ? "#5034c9" : "#5e8ad1",
              }}
            >
              Line
            </button>
          </div>
          <div className="arrow">
            <button
              onClick={() => setTool("arrow")}
              style={{
                backgroundColor: tool === "arrow" ? "#5034c9" : "#5e8ad1",
              }}
            >
              Arrow
            </button>
          </div>
          <div className="rectangle">
            <button
              onClick={() => setTool("rectangle")}
              style={{
                backgroundColor: tool === "rectangle" ? "#5034c9" : "#5e8ad1",
              }}
            >
              Rectangle
            </button>
          </div>
          <div className="eraser">
            <button
              onClick={() => setTool("eraser")}
              style={{
                backgroundColor: tool === "eraser" ? "#5034c9" : "#5e8ad1",
              }}
            >
              Eraser
            </button>
          </div>
          <div className="reset">
            <button
              onClick={resetCanvas}
              style={{
                backgroundColor: "#454d85",
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
