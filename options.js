let swatchDiv = document.getElementById("swatchDiv");

const canvasHeight = 700;
const canvasWidth = 700;
var canvasEl = document.getElementById('quilt');
let currentFabrics = [];

// get 2d context to draw on (the "bitmap" mentioned earlier)
var ctx = canvasEl.getContext('2d');

const drawQuilt = (redraw = false, newSet) => {
  const squareSize = 100;
  const offset = 100;
  const canvasHeight = 700;
  const canvasWidth = 700;

  chrome.storage.sync.get('fabrics', ({ fabrics }) => {


    currentFabrics = fabrics.map((fabric, i) => {
      if (!redraw) {
        // create swatch for visibility
        let swatch = document.createElement('img');
        swatch.id = 'swatch';
        swatch.classList.add('selected');
        swatch.setAttribute('data-id', i);
        swatch.addEventListener("click", toggleSwatch);
        swatch.src = fabric;
        swatch.height = 50;
        swatch.width = 50;
        swatchDiv.appendChild(swatch);
      }

      // creat canvas element
      let img = new Image();
      img.src = fabric;
      return img;
    });


    let fabricSet;
    if (redraw) {
      fabricSet = newSet;
    } else { fabricSet = currentFabrics; }
    console.log(fabricSet);

    // Iterate through the fabrics saved
    fabricSet.forEach((fabric, i) => {

      const simpleGrid = () => {
        for (let k = 0; k < (canvasHeight / squareSize); k++) {
          // Rows
          for (let j = 0; j < (canvasWidth / squareSize) / (fabricSet.length - 1); j++) {
            // Columns
            if (k % 2 === 1) {
              // even rows are offset
              ctx.drawImage(
                fabric,
                getRandomOffset(offset),
                getRandomOffset(offset),
                squareSize * 1.5,
                squareSize * 1.5,
                i * squareSize + j * (squareSize * fabricSet.length) - (squareSize),
                k * (squareSize),
                squareSize,
                squareSize
              );
            } else {
              ctx.drawImage(
                fabric,
                getRandomOffset(offset),
                getRandomOffset(offset),
                squareSize * 1.5,
                squareSize * 1.5,
                i * squareSize + j * (squareSize * fabricSet.length),
                k * (squareSize),
                squareSize,
                squareSize
              );
            }
          }
        }
      }

      const spacedGrid = () => {
        for (let k = 0; k < (canvasHeight / squareSize)+1; k++) {
          // Rows
          for (let j = 0; j < (canvasWidth / squareSize); j++) {
            // Columns
            if (i === 0) {
              if (k % 2 === 1) {
                // even rows are offset
                ctx.drawImage(
                  fabric,
                  getRandomOffset(offset),
                  getRandomOffset(offset),
                  squareSize * 1.5,
                  squareSize * 1.5,
                  j * (squareSize * 2) - (squareSize),
                  k * (squareSize),
                  squareSize,
                  squareSize
                );
              } else {
                ctx.drawImage(
                  fabric,
                  getRandomOffset(offset),
                  getRandomOffset(offset),
                  squareSize * 1.5,
                  squareSize * 1.5,
                  j * (squareSize * 2),
                  k * (squareSize),
                  squareSize,
                  squareSize
                );
              }
            } else if (k === i || k-(fabricSet.length-1) === i) {
              if (k % 2 === 0) {
                // even rows are offset
                ctx.drawImage(
                  fabric,
                  getRandomOffset(offset),
                  getRandomOffset(offset),
                  squareSize * 1.5,
                  squareSize * 1.5,
                  squareSize + j * (squareSize * 2) - (squareSize),
                  (k - 1) * (squareSize),
                  squareSize,
                  squareSize
                );
              } else {
                ctx.drawImage(
                  fabric,
                  getRandomOffset(offset),
                  getRandomOffset(offset),
                  squareSize * 1.5,
                  squareSize * 1.5,
                  squareSize + j * (squareSize * 2),
                  (k - 1) * (squareSize),
                  squareSize,
                  squareSize
                );
              }
            }

          }
        }
      }

      if (redraw) {
        if (fabricSet.length < 3) {
          simpleGrid();
        } else { spacedGrid(); }
      } else {
        // need to load the first time
        fabric.onload = function () {
          spacedGrid();
        };
      }
    });
  });

}

const toggleSwatch = (e) => {
  let selectedSwatches = document.getElementsByClassName('selected');
  if (selectedSwatches.length === 2 && e.target.classList.contains('selected')) {
    return;
  }
  e.target.classList.toggle('selected');
  selectedSwatches = document.getElementsByClassName('selected');
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  let newSet = [];
  for (let fabric of selectedSwatches) {
    newSet = [...newSet, currentFabrics[fabric.dataset.id]];
  }
  drawQuilt(true, newSet);
}

const removeSwatches = () => {
  chrome.storage.sync.set({ fabrics: [] });
  location.reload();
}

const getRandomOffset = (max) => {
  return Math.floor(Math.random() * max)
}

drawQuilt();

let restButton = document.getElementById('reset');
restButton.addEventListener('click', removeSwatches);