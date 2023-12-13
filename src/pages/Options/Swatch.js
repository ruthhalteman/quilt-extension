import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Swatch.css";

const Swatch = ({ fabricSwatchData, id, toggleSwatch }) => {
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
        From {fabricSwatchData.pageUrl.replace(/.+\/\/|www.|\..+/g, '')}<br></br>
        <a
          href={fabricSwatchData.linkUrl || fabricSwatchData.pageUrl}
          target="_blank"
        >
          Go to this fabric's page
        </a>
      </span>
      <span style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={deleteSwatch}>delete</button>
        <button onClick={()=>toggleSwatch(fabricSwatchData.imageUrl)}>toggle visibility</button>
      </span>
    </div>
  );
};

export default Swatch;
