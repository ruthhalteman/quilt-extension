import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Swatch.css";

const Swatch = ({ imageUrl, id }) => {
  const deleteSwatch = () => {
    chrome.storage.sync.get("fabrics", ({ fabrics }) => {
      chrome.storage.sync.set({
        fabrics: fabrics.filter((fabric) => fabric.imageUrl !== imageUrl),
      });
    });
  };

  return (
    <div className="swatchContainer">
      <img className="swatch" src={imageUrl} key={id} />
      <span className="text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet
        quam ut est hendrerit, in convallis massa hendrerit.
      </span>
      <button onClick={deleteSwatch}>delete</button>
    </div>
  );
};

export default Swatch;
