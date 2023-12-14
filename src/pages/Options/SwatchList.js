import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./Swatch.css";
import Swatch from "./Swatch";

const SwatchList = ({ fabricSwatches }) => {

  return (
    <div className="swatchListContainer">
          {fabricSwatches.map((fabricSwatchData, id) => (
            <Swatch
              key={id}
              fabricSwatchData={fabricSwatchData}
            />
          ))}
        </div>
  );
};

export default SwatchList;
