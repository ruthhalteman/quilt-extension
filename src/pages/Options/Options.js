import React, { useEffect } from "react";
import "./Options.css";
import { useRef, useState } from "react";
import { fabric } from "fabric";
import Swatch from "./Swatch";

const Options = () => {
  const canvasHeight = 500;
  const canvasWidth = 500;
  const [currentFabrics, setFabrics] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const quiltRef = useRef(null);

  const [quilt, setQuilt] = useState(null);

  // update swatch list when we add while shopping
  chrome.storage.onChanged.addListener((changes) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === "fabrics") {
        setFabrics(newValue);
      }
    }
  });

  useEffect(() => {
    // get fabrics from storage
    chrome.storage.sync.get(["fabrics"], ({ fabrics }) => {
      setFabrics(fabrics);
      setSelectedFabrics(fabrics);
      setQuilt(
        new fabric.Canvas(quiltRef.current, {
          height: canvasHeight,
          width: canvasWidth,
          backgroundColor: "#ccc",
        })
      );
      renderSwatches(fabrics);
    });
  }, []);

  const renderSwatches = (list) => {
    const squareSize = 100;
    const swatchCount = list.length;

    list.filter((swatch)=>(!swatch.visible)).forEach((fabricSwatchData, i) => {
      for (let k = 0; k < canvasHeight / squareSize; k++) {
        for (let j = 0; j < canvasWidth / squareSize; j++) {
          if (k % 2 === 0) {
            fabric.Image.fromURL(fabricSwatchData.imageUrl, (img) => {
              img.width = squareSize;
              img.height = squareSize;
              img.left = i * squareSize;
              img.top = k * squareSize;
              quilt.add(img);
            });
          } else {
            fabric.Image.fromURL(fabricSwatchData.imageUrl, (img) => {
              img.width = squareSize;
              img.height = squareSize;
              img.left = (i - 1) * squareSize;
              img.top = k * squareSize;
              quilt.add(img);
            });
          }
        }
      }
    });
    quilt.renderAll();
  };

  const clearSwatches = () => {
    chrome.storage.sync.set({ fabrics: [] });
  };

  const toggleSwatchHandler = (imgUrl) => {
    let newSelectedFabrics = selectedFabrics.map((swatch) => {
      if (swatch.imageUrl === imgUrl) {
        swatch.visible = !swatch.visible;
        return swatch;
      } else {
        return swatch;
      }
    });
    setSelectedFabrics(newSelectedFabrics);
    quilt.clear();
    renderSwatches(newSelectedFabrics);
  };

  return (
    <div className="OptionsContainer">
      <div className="header">
        Fabric <span>Vibe Check</span>
      </div>
      <div className="contentContainer">
        <div className="canvasContainer">
          <canvas className="quiltCanvas" ref={quiltRef}></canvas>
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
