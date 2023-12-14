import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Options.css";
import { Button, InputNumber, Select, Space, Typography } from "antd";
const { Text, Link } = Typography;
import {
    DeleteOutlined,
    DownloadOutlined
  } from "@ant-design/icons";

const SettingsPanel = ({
  gridSize,
  setGridSize,
  clearSwatches,
  exportQuilt,
  changeLayout,
  selectedLayout,
}) => {
  return (
    <div style={{ padding: 15, textAlign:'right' }}>
      <Space align={"center"}>
        <Text>Layout:</Text>
        <Select
          name="layouts"
          id="layout-select"
          onChange={changeLayout}
          defaultValue={selectedLayout}
          style={{width: 150}}
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
          style={{width: 200}}
        ></InputNumber>
      </Space>
      <br />
      <br />
      <Space>
        <Button onClick={clearSwatches} icon={<DeleteOutlined />}>Clear All Swatches</Button>{" "}
        <Button onClick={exportQuilt} icon={<DownloadOutlined />}>Save Image</Button>
      </Space>
    </div>
  );
};

export default SettingsPanel;
