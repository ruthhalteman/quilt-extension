import React, { useEffect } from "react";
import "./Options.css";
import { useState } from "react";
import { fabric } from "fabric";
import Swatch from "./Swatch";

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
        quilt.clear();
        renderSwatches(newValue, quilt);
      }
    }
  });

  useEffect(() => {
    // get fabrics from storage
    chrome.storage.sync.get(["fabrics"], ({ fabrics }) => {
      setFabrics(fabrics);
      const quiltCanvas = new fabric.Canvas(
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
    if (list.length === 0) {
      return;
    }
    const squareSize = canvasWidth / 5;

    const visibleSwatches = list.filter((swatch) => swatch.visible);
    const swatchCount = visibleSwatches.length;

    for (let i = 0; i < canvasWidth / squareSize; i++) {
      for (let j = 0; j < canvasHeight / squareSize; j++) {
        const swatch = visibleSwatches[(i + j) % swatchCount];
        fabric.Image.fromURL(swatch.imageUrl, (img) => {
          img.width = squareSize;
          img.height = squareSize;
          img.left = i * squareSize;
          img.top = j * squareSize;
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
    setFabrics(newSelectedFabrics);
    quilt.clear();
    renderSwatches(newSelectedFabrics, quilt);
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
