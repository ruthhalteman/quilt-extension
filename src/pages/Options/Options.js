import React, { useEffect } from "react";
import "./Options.css";
import { useRef, useState } from "react";
import { fabric } from "fabric";
import Swatch from "./Swatch";

const Options = () => {
  const canvasHeight = 500;
  const canvasWidth = 500;
  const [currentFabrics, setFabrics] = useState([]);
  const quilt = useRef(null);

  // update swatch list when we add while shopping
  chrome.storage.onChanged.addListener((changes) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === 'fabrics') {
        setFabrics(newValue);
      }
    }
  });

  useEffect(() => {
    // get fabrics from storage
    chrome.storage.sync.get(
      ["fabrics", "selectedFabrics"],
      ({ fabrics, selectedFabrics }) => {
        console.log(fabrics);
        setFabrics(fabrics);
      }
    );

    // set up canvas stuff
    const canvas = new fabric.Canvas(quilt.current, {
      height: canvasHeight,
      width: canvasWidth,
      backgroundColor: "#ccc",
    });
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 20,
      height: 20,
    });
    canvas.add(rect);
    canvas.renderAll();
  }, []);

  const clearSwatches = () => {
    chrome.storage.sync.set({ fabrics: [] });
  };

  return (
    <div className="OptionsContainer">
      <div className="header">Fabric <span>Vibe Check</span></div>
      <div className="contentContainer">
        <div className="canvasContainer">
          <canvas className="quiltCanvas" ref={quilt}></canvas>
        </div>
        <div className="swatchListContainer">
          {currentFabrics.map((fabric, id) => (
            <Swatch imageUrl={fabric.imageUrl} key={id} />
          ))}
        </div>
      </div>
      <button onClick={clearSwatches}>Clear</button>
    </div>
  );
};

export default Options;
