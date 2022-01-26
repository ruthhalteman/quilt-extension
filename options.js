let swatchDiv = document.getElementById("swatchDiv");

const canvasHeight = 700;
const canvasWidth = 700;
var canvasEl = document.getElementById('quilt');
let currentFabrics = [];

// get 2d context to draw on (the "bitmap" mentioned earlier)
var ctx = canvasEl.getContext('2d');

const drawQuilt = (redraw = false, newSet) => {
  const squareSize = 100;
  const offset = 200;
  const canvasHeight = 700;
  const canvasWidth = 700;



  chrome.storage.sync.get(['fabrics', 'selectedFabrics'], ({ fabrics, selectedFabrics }) => {

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
      //chrome.storage.sync.set({ selectedFabrics: fabricSet });
    } else {
      fabricSet = currentFabrics;
    }



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
        for (let k = 0; k < (canvasHeight / squareSize) + 1; k++) {
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
            } else if (k === i || k % (fabricSet.length - 1) === i || k === (fabricSet.length - 1) * 2 || k === (fabricSet.length - 1) * 3) {
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

  // if (document.getElementById('background').classList.contains('editing')) {
  //   chooseNewBackground(e)
  //   return;
  // }

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
  chrome.storage.sync.set({ quiltBackground: '' });
  location.reload();
}

const getRandomOffset = (max) => {
  return Math.floor(Math.random() * max)
}

const editBackground = () => {
  const background = document.getElementById('background');
  background.classList.add('editing');
  console.log('edit background');
}

const chooseNewBackground = (e) => {
  chrome.storage.sync.set({ quiltBackground: e.target.src });
  location.reload();
}

const renderBackgroundSwatch = () => {

  chrome.storage.sync.get('quiltBackground', ({ quiltBackground }) => {
    if (quiltBackground === '') {
      return;
    }
    let swatch = document.createElement('img');
    swatch.id = 'background';
    swatch.addEventListener("click", editBackground); swatch.height = 50;
    swatch.width = 50;
    console.log(quiltBackground);
    swatch.src = quiltBackground;
    swatchDiv.appendChild(swatch);
  });
}

//renderBackgroundSwatch();
drawQuilt();

let restButton = document.getElementById('reset');
restButton.addEventListener('click', removeSwatches);