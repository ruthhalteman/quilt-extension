let swatchDiv = document.getElementById("swatchDiv");
let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

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

  chrome.storage.sync.get('fabrics', ({ fabrics }) => {

    const canvasHeight = 700;
    const canvasWidth = 700;
    var canvasEl = document.getElementById('quilt');

    // get 2d context to draw on (the "bitmap" mentioned earlier)
    var ctx = canvasEl.getContext('2d');

    const fabImgs = fabrics.map((fabric, i) => {

      // create swatch for visibility
      let swatch = document.createElement('img');
      swatch.id = 'swatch';
      swatch.addEventListener("click", toggleSwatch);
      swatch.src = fabric;
      swatch.height = 50;
      swatch.width = 50;
      swatchDiv.appendChild(swatch);

      // creat canvas element
      let img = new Image();
      img.src = fabric;
      return img;
    });

    let newFab = [...fabImgs];

    const squareSize = 100;
    // Iterate through the fabrics saved
    newFab.forEach((fabric, i) => {

      fabric.onload = function () {
        for (let k = 0; k < (canvasHeight/squareSize); k++) {
          // Rows
          for (let j = 0; j < (canvasWidth/squareSize)/(fabImgs.length-1); j++) {
            // Columns
            if (k % 2 === 1) {
              // even rows are offset
              ctx.drawImage(fabric, i * squareSize + j * (squareSize * fabImgs.length) - (squareSize), 0 * squareSize + k * (squareSize), squareSize, squareSize);
            } else {
              ctx.drawImage(fabric, i * squareSize + j * (squareSize * fabImgs.length), 0 * squareSize + k * (squareSize), squareSize, squareSize);
            }
          }
        }
      };
    });
  });
}

const toggleSwatch = () => {
  console.log('toggle swatch');
}

const removeSwatches = () => {
  chrome.storage.sync.set({fabrics: []});
  location.reload();
}

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);

let restButton = document.getElementById('reset');
restButton.addEventListener('click', removeSwatches);