import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Options.css";

const SettingsPanel = ({ gridSize, setGridSize, clearSwatches, exportQuilt }) => {
  return (
    <div style={{padding: 15}}>
      {" "}
      Grid Size:{" "}
      <input
        type="number"
        value={gridSize}
        onChange={(e) => {
          setGridSize(e.target.value);
        }}
      ></input>{" "}
      <button onClick={clearSwatches}>Clear All Swatches</button>
      <button onClick={exportQuilt}>Save Image</button>
    </div>
  );
};

export default SettingsPanel;
