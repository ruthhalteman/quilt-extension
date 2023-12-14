import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Options.css";
import { Button, InputNumber, Select, Space, Typography } from "antd";
const { Text, Link } = Typography;

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
      <Space align={"center"}>
        <Text>Layout:</Text>
        <Select
          name="layouts"
          id="layout-select"
          onChange={changeLayout}
          defaultValue={selectedLayout}
        >
          <option value="basic">Basic Squares</option>
          <option value="randomHST">Scattered HSTs</option>
          <option value="modaLove">Moda Love</option>
        </Select>
        <InputNumber
          value={gridSize}
          addonBefore="Grid Size"
          max={20}
          min={1}
          disabled={selectedLayout === "modaLove"}
          onChange={(value) => {
            setGridSize(value);
          }}
        ></InputNumber>
      </Space>
      <br />
      <br />
      <Space>
        <Button onClick={clearSwatches}>Clear All Swatches</Button>{" "}
        <Button onClick={exportQuilt}>Save Image</Button>
      </Space>
    </div>
  );
};

export default SettingsPanel;
