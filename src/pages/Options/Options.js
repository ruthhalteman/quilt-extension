import React, { useEffect } from "react";
import "./Options.css";
import { useState } from "react";
import { fabric } from "fabric";
import SettingsPanel from "./SettingsPanel";
import SwatchList from "./SwatchList";

const getRandomOffset = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 0 = background
// 1 = foreground
// 2 = top left hst
// 3 = top right hst
// 4 = bottom left hst
// 5 = bottom right hst
const modaLovePositions = [
  [0, 0, 4, 5, 4, 5, 0, 0],
  [0, 1, 1, 2, 3, 1, 1, 0],
  [3, 1, 0, 4, 5, 0, 1, 2],
  [5, 2, 3, 5, 4, 2, 3, 4],
  [3, 4, 5, 3, 2, 4, 5, 2],
  [5, 1, 0, 2, 3, 0, 1, 4],
  [0, 1, 1, 4, 5, 1, 1, 0],
  [0, 0, 2, 3, 2, 3, 0, 0],
];

// 0 is no color
// 1 is random
const modaLoveColors = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 2, 2, 0, 1, 1],
  [1, 1, 2, 3, 3, 2, 1, 1],
  [1, 1, 2, 3, 3, 2, 1, 1],
  [1, 1, 0, 2, 2, 0, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
];

const EmptyState = () => {
  return (
    <div
      style={{
        height: 500,
        width: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        position: "absolute",
      }}
    >
      Start adding some fabrics!
    </div>
  );
};

const Options = () => {
  const canvasHeight = 500;
  const canvasWidth = 500;
  const [currentFabrics, setFabrics] = useState([]);
  const [currentGridSize, setCurrentGridSize] = useState(6);
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentLayout, setCurrentLayout] = useState("basic");

  const [quilt, setQuilt] = useState(null);

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
      const quiltCanvas = new fabric.StaticCanvas(
        document.getElementById("quiltCanvas"),
        {
          height: canvasHeight,
          width: canvasWidth,
        }
      );
      setQuilt(quiltCanvas);
    });
  }, []);

  const renderSwatches = (list, quiltCanvas) => {
    // wut
    if (!quiltCanvas) {
      return;
    }
    let gridSize = currentGridSize;
    if (currentLayout == "modaLove" && gridSize != 8) {
      setCurrentGridSize(8);
      gridSize = 8;
    }

    const squareSize = canvasWidth / gridSize;
    const largeSquareSize = squareSize > canvasWidth / 5;
    const scale = largeSquareSize ? 1 : 0.5;

    const visibleSwatches = list.filter((swatch) => swatch.visible);
    const swatchCount = visibleSwatches.length;

    console.log(
      `rendering the quilt with ${swatchCount} fabrics, in a grid of size ${gridSize}, with ${currentLayout} layout`
    );

    // Chose these by experimentation, to avoid getting borders, watermarks etc in the image
    const offsetMin = 20;
    const offsetMax = largeSquareSize ? 120 : 80;

    if (swatchCount === 0) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);

    // we always want to clear, since we load a full design every time
    quiltCanvas.clear();

    // A layout that's just a grid of squares
    const basicLayout = () => {
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
    };

    const trianglePoints = [
      { x: 0, y: 0 },
      { x: squareSize, y: 0 },
      { x: 0, y: squareSize },
    ];

    const HSTLayout = () => {
      for (let i = 0; i < canvasWidth / squareSize; i++) {
        for (let j = 0; j < canvasHeight / squareSize; j++) {
          fabric.Image.fromURL(visibleSwatches[swatchCount-1].imageUrl, (img) => {
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
            quiltCanvas.add(img);
          });

          const foregroundSwatches = visibleSwatches.slice(0, swatchCount-1);
          const foregroundSwatchCount = foregroundSwatches.length;
          if (foregroundSwatchCount != 0) {
            const swatch =
              foregroundSwatches[getRandomOffset(0, foregroundSwatchCount - 1)];
            if (largeSquareSize ? Math.random() > 0.3 : Math.random() > 0.4) {
              fabric.Image.fromURL(swatch.imageUrl, (img) => {
                img.scale(scale).set({
                  top: j * squareSize - getRandomOffset(offsetMin, offsetMax),
                  left: i * squareSize - getRandomOffset(offsetMin, offsetMax),
                  clipPath: new fabric.Polygon(trianglePoints, {
                    width: squareSize,
                    height: squareSize,
                    absolutePositioned: true,
                    top: j * squareSize,
                    left: i * squareSize,
                    flipX: Math.random() > 0.5,
                    flipY: Math.random() > 0.5,
                  }),
                });
                quiltCanvas.add(img);
              });
            }
          }
        }
      }
    };

    const modaLoveLayout = () => {
      for (let i = 0; i < canvasWidth / squareSize; i++) {
        for (let j = 0; j < canvasHeight / squareSize; j++) {
          fabric.Image.fromURL(visibleSwatches[swatchCount-1].imageUrl, (img) => {
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
            quiltCanvas.add(img);
          });

          const foregroundSwatches = visibleSwatches.slice(0, swatchCount-1);
          const foregroundSwatchCount = foregroundSwatches.length;
          if (foregroundSwatchCount != 0) {
            const swatch =
              foregroundSwatchCount > 1
                ? foregroundSwatches[
                    modaLoveColors[j][i] == 2
                      ? 0
                      : getRandomOffset(1, foregroundSwatchCount - 1)
                  ]
                : foregroundSwatches[
                    getRandomOffset(0, foregroundSwatchCount - 1)
                  ];
            switch (modaLovePositions[j][i]) {
              case 0:
                break;
              case 1:
                fabric.Image.fromURL(swatch.imageUrl, (img) => {
                  img.scale(scale).set({
                    top: j * squareSize - getRandomOffset(offsetMin, offsetMax),
                    left:
                      i * squareSize - getRandomOffset(offsetMin, offsetMax),
                    clipPath: new fabric.Rect({
                      width: squareSize,
                      height: squareSize,
                      absolutePositioned: true,
                      top: j * squareSize,
                      left: i * squareSize,
                    }),
                  });
                  quiltCanvas.add(img);
                });
                break;
              case 2:
                fabric.Image.fromURL(swatch.imageUrl, (img) => {
                  img.scale(scale).set({
                    top: j * squareSize - getRandomOffset(offsetMin, offsetMax),
                    left:
                      i * squareSize - getRandomOffset(offsetMin, offsetMax),
                    clipPath: new fabric.Polygon(trianglePoints, {
                      width: squareSize,
                      height: squareSize,
                      absolutePositioned: true,
                      top: j * squareSize,
                      left: i * squareSize,
                      flipX: false,
                      flipY: false,
                    }),
                  });
                  quiltCanvas.add(img);
                });
                break;
              case 3:
                fabric.Image.fromURL(swatch.imageUrl, (img) => {
                  img.scale(scale).set({
                    top: j * squareSize - getRandomOffset(offsetMin, offsetMax),
                    left:
                      i * squareSize - getRandomOffset(offsetMin, offsetMax),
                    clipPath: new fabric.Polygon(trianglePoints, {
                      width: squareSize,
                      height: squareSize,
                      absolutePositioned: true,
                      top: j * squareSize,
                      left: i * squareSize,
                      flipX: true,
                      flipY: false,
                    }),
                  });
                  quiltCanvas.add(img);
                });
                break;
              case 4:
                fabric.Image.fromURL(swatch.imageUrl, (img) => {
                  img.scale(scale).set({
                    top: j * squareSize - getRandomOffset(offsetMin, offsetMax),
                    left:
                      i * squareSize - getRandomOffset(offsetMin, offsetMax),
                    clipPath: new fabric.Polygon(trianglePoints, {
                      width: squareSize,
                      height: squareSize,
                      absolutePositioned: true,
                      top: j * squareSize,
                      left: i * squareSize,
                      flipX: false,
                      flipY: true,
                    }),
                  });
                  quiltCanvas.add(img);
                });
                break;
              case 5:
                fabric.Image.fromURL(swatch.imageUrl, (img) => {
                  img.scale(scale).set({
                    top: j * squareSize - getRandomOffset(offsetMin, offsetMax),
                    left:
                      i * squareSize - getRandomOffset(offsetMin, offsetMax),
                    clipPath: new fabric.Polygon(trianglePoints, {
                      width: squareSize,
                      height: squareSize,
                      absolutePositioned: true,
                      top: j * squareSize,
                      left: i * squareSize,
                      flipX: true,
                      flipY: true,
                    }),
                  });
                  quiltCanvas.add(img);
                });
                break;
            }
          }
        }
      }
    };

    if (currentLayout == "basic") {
      basicLayout();
    } else if (currentLayout == "modaLove") {
      modaLoveLayout();
    } else {
      HSTLayout();
    }

    quiltCanvas.renderAll();
  };

  const clearSwatches = () => {
    chrome.storage.sync.set({ fabrics: [] });
    quilt.clear();
  };

  const exportQuilt = () => {
    const dataURL = quilt.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.download = "quilt-idea.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    renderSwatches(currentFabrics, quilt);
  }, [currentGridSize, currentLayout, currentFabrics]);

  return (
    <div className="OptionsContainer">
      <div className="header">
        Fabric <span>Vibe Check</span>
      </div>
      <div className="contentContainer">
        <div className="canvasContainer">
          {isEmpty && <EmptyState />}
          <canvas className="quiltCanvas" id="quiltCanvas"></canvas>

          <SettingsPanel
            clearSwatches={clearSwatches}
            gridSize={currentGridSize}
            setGridSize={setCurrentGridSize}
            exportQuilt={exportQuilt}
            selectedLayout={currentLayout}
            changeLayout={(layout) => {
              setCurrentLayout(layout);
            }}
          />
        </div>
        <SwatchList fabricSwatches={currentFabrics} />
      </div>
    </div>
  );
};

export default Options;
