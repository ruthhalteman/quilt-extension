import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Swatch.css";
import { Button, Typography, Space } from "antd";
const { Text, Link } = Typography;
import {
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const Swatch = ({ fabricSwatchData, id }) => {
  const deleteSwatch = () => {
    chrome.storage.sync.get("fabrics", ({ fabrics }) => {
      chrome.storage.sync.set({
        fabrics: fabrics.filter(
          (fabric) => fabric.imageUrl !== fabricSwatchData.imageUrl
        ),
      });
    });
  };

  const toggleSwatch = (imgUrl) => {
    chrome.storage.sync.get("fabrics", ({ fabrics }) => {
      let newSelectedFabrics = fabrics.map((swatch) => {
        if (swatch.imageUrl === imgUrl) {
          swatch.visible = !swatch.visible;
          return swatch;
        } else {
          return swatch;
        }
      });
      chrome.storage.sync.set({ fabrics: newSelectedFabrics });
    });
  };

  return (
    <div
      className="swatchContainer"
      style={{
        opacity: fabricSwatchData.visible ? 1 : 0.5,
        background: "#fff",
      }}
    >
      <Space>
        <img className="swatch" src={fabricSwatchData.imageUrl} key={id} />
        <span className="text">
          <Text>
            From{" "}
            <b>{fabricSwatchData.pageUrl.replace(/.+\/\/|www.|\..+/g, "")}</b>
          </Text>
          <br></br>
          <Link
            href={fabricSwatchData.linkUrl || fabricSwatchData.pageUrl}
            target="_blank"
          >
            View on site
          </Link>
        </span>
      </Space>

      <span style={{ display: "grid", gridGap: 5 }}>
        <Button onClick={deleteSwatch} icon={<DeleteOutlined />} />
        <Button
          onClick={() => toggleSwatch(fabricSwatchData.imageUrl)}
          icon={
            fabricSwatchData.visible ? (
              <EyeOutlined />
            ) : (
              <EyeInvisibleOutlined />
            )
          }
        />
      </span>
    </div>
  );
};

export default Swatch;
