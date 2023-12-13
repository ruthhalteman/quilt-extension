import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Swatch.css";

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

  return (
    <div className="swatchContainer">
      <img className="swatch" src={fabricSwatchData.imageUrl} key={id} />
      <span className="text">
        <a
          href={fabricSwatchData.linkUrl || fabricSwatchData.pageUrl}
          target="_blank"
        >
          Buy Fabric
        </a>
      </span>
      <button onClick={deleteSwatch}>delete</button>
    </div>
  );
};

export default Swatch;
