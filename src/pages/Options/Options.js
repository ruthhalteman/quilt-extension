import React, { useEffect } from "react";
import "./Options.css";
import { useState } from "react";
import { fabric } from "fabric";
import Swatch from "./Swatch";

const getRandomOffset = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Options = () => {
  const canvasHeight = 500;
  const canvasWidth = 500;
  const [currentFabrics, setFabrics] = useState([]);

  const [quilt, setQuilt] = useState(null);

  // update swatch list when we add while shopping
  chrome.storage.onChanged.addListener((changes) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === "fabrics") {
        setFabrics(newValue);
        renderSwatches(newValue, quilt);
      }
    }
  });

  useEffect(() => {
    // get fabrics from storage
    chrome.storage.sync.get(["fabrics"], ({ fabrics }) => {
      setFabrics(fabrics);
      const quiltCanvas = new fabric.StaticCanvas(
        document.getElementById("quiltCanvas"),
        {
          height: canvasHeight,
          width: canvasWidth,
        }
      );
      setQuilt(quiltCanvas);
      renderSwatches(fabrics, quiltCanvas);
    });
  }, []);

  const renderSwatches = (list, quiltCanvas) => {
    // wut
    if (!quiltCanvas) {
      return;
    }

    const squareSize = canvasWidth / 8;
    const scale = 0.5;

    const visibleSwatches = list.filter((swatch) => swatch.visible);
    const swatchCount = visibleSwatches.length;

    // Chose these by experimentation, to avoid getting borders, watermarks etc in the image
    const offsetMin = squareSize * 0.2;
    const offsetMax = squareSize / scale - squareSize * 0.2;

    if (swatchCount === 0) {
      return;
    }

    // we always want to clear, since we load a full design every time
    quiltCanvas.clear();

    for (let i = 0; i < canvasWidth / squareSize; i++) {
      for (let j = 0; j < canvasHeight / squareSize; j++) {
        const swatch = visibleSwatches[(i + j) % swatchCount];
        fabric.Image.fromURL(swatch.imageUrl, (img) => {
          img.scale(scale).set({
            top: j * squareSize - getRandomOffset(offsetMin, offsetMax),
            left: i * squareSize - getRandomOffset(offsetMin, offsetMax),
            clipPath: new fabric.Rect({
              width: squareSize,
              height: squareSize,
              absolutePositioned: true,
              top: j * squareSize,
              left: i * squareSize,
            }),
          });
          const debuggingRect = new fabric.Rect({
            width: squareSize,
            height: squareSize,
            top: j * squareSize,
            left: i * squareSize,
            fill: "transparent",
            stroke: "black",
            strokeWidth: 1,
          });
          quiltCanvas.add(img);
        });
      }
    }
    quiltCanvas.renderAll();
  };

  const clearSwatches = () => {
    chrome.storage.sync.set({ fabrics: [] });
  };

  const toggleSwatchHandler = (imgUrl) => {
    let newSelectedFabrics = currentFabrics.map((swatch) => {
      if (swatch.imageUrl === imgUrl) {
        swatch.visible = !swatch.visible;
        return swatch;
      } else {
        return swatch;
      }
    });
    chrome.storage.sync.set({ fabrics: newSelectedFabrics });
  };

  return (
    <div className="OptionsContainer">
      <div className="header">
        Fabric <span>Vibe Check</span>
      </div>
      <div className="contentContainer">
        <div className="canvasContainer">
          <canvas className="quiltCanvas" id="quiltCanvas"></canvas>
          <button onClick={clearSwatches}>Clear</button>
        </div>
        <div className="swatchListContainer">
          {currentFabrics.map((fabricSwatchData, id) => (
            <Swatch
              key={id}
              fabricSwatchData={fabricSwatchData}
              toggleSwatch={toggleSwatchHandler}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Options;
