let swatchDiv = document.getElementById("swatchDiv");
let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

const canvasHeight = 700;
const canvasWidth = 700;
var canvasEl = document.getElementById('quilt');
let currentFabrics = [];

// get 2d context to draw on (the "bitmap" mentioned earlier)
var ctx = canvasEl.getContext('2d');
// Reacts to a button click by marking marking the selected button and saving
// the selection
function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors) {
  // chrome.storage.sync.get("color", (data) => {
  //   let currentColor = data.color;

  //   // For each color we were provided…
  //   for (let buttonColor of buttonColors) {
  //     // …crate a button with that color…
  //     let button = document.createElement("button");
  //     button.dataset.color = buttonColor;
  //     button.style.backgroundColor = buttonColor;

  //     // …mark the currently selected color…
  //     if (buttonColor === currentColor) {
  //       button.classList.add(selectedClassName);
  //     }

  //     // …and register a listener for when that button is clicked
  //     button.addEventListener("click", handleButtonClick);
  //     page.appendChild(button);
  //   }
  // });


}

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
                0 * squareSize + k * (squareSize),
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
                0 * squareSize + k * (squareSize),
                squareSize,
                squareSize
              );
            }
          }
        }
      }

      if (redraw) {
        simpleGrid();
      } else {
        fabric.onload = function () {
          simpleGrid();
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

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);

drawQuilt();

let restButton = document.getElementById('reset');
restButton.addEventListener('click', removeSwatches);