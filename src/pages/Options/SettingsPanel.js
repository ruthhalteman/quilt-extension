import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Options.css";

const SettingsPanel = ({
  gridSize,
  setGridSize,
  clearSwatches,
  exportQuilt,
  changeLayout,
  selectedLayout,
}) => {
  return (
    <div style={{ padding: 15 }}>
      {" "}
      Grid Size:{" "}
      <input
        type="number"
        value={gridSize}
        max={20}
        min={1}
        onChange={(e) => {
          setGridSize(e.target.value);
        }}
      ></input>{" "}
      <select
        name="layouts"
        id="layout-select"
        onChange={changeLayout}
        defaultValue={selectedLayout}
      >
        <option value="basic">Basic Squares</option>
        <option value="randomHST">Scattered HSTs</option>
      </select>{" "}
      <button onClick={clearSwatches}>Clear All Swatches</button>{" "}
      <button onClick={exportQuilt}>Save Image</button>
    </div>
  );
};

export default SettingsPanel;
