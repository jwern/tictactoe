// IIFE initialized immediately; returned methods available for call
const Gameboard = (() => {
  // let rows = [
  //   ["x", "o", "x"],
  //   ["o", "x", "o"],
  //   [" ", "o", "o"]
  // ];
  let boardWidth = 3;
  let boardHeight = 3;
  let rows = [...Array(boardHeight)].map(() => Array(boardWidth).fill("x"));

  const buildGameBoard = () => {
    let board = document.getElementById('game-board');
    // Create the CSS grid to match the width and height of the rows array
    board.style.gridTemplateRows = `repeat(${boardHeight}, 1fr)`;
    board.style.gridTemplateColumns = `repeat(${boardWidth}, 1fr)`;

    for (row of rows) {
      let rowIndex = rows.indexOf(row);
      row.forEach((item, index) => {
        let square = document.createElement('div');
        square.classList.add('board-square');
        // If not the last row on the page, add bottom-border
        if (rowIndex !== rows.length - 1) {
          square.classList.add('bottom-border');
        }
        // If not the last column on the page, add right-border
        if (index !== row.length - 1) {
          square.classList.add('right-border');
        }
        // Sets a data-id that matches row-column index, e.g.:
        // upper-left corner will be data-id: 0-0
        // bottom-right corner in a 3x3 grid will be 2-2
        square.setAttribute('data-id', `${rowIndex}-${index}`);
        square.innerText = item;
        board.append(square);
      })
    }

    const setupListeners = (() => {
      let squares = board.querySelectorAll('.board-square');
      squares.forEach(square => square.addEventListener('click', PlayGame.squareClicked));
    })()
  }

  return { 
    rows, 
    buildGameBoard,
  };
})()

// Factory Function that can be used to create players
const Player = playerName => {
  let name = playerName;
  return { name };
}

// IIFE initialized immediately; returned methods available for call
const PlayGame = (() => {
  // let player1 = Player(prompt("Who is player 1?"));
  // let player2 = Player(prompt("And player 2?"));
  let player1 = Player("Me");
  let player2 = Player("You");

  let gameStart = () => {
    console.log(`The game has begun, ${player1.name} & ${player2.name}`);
    Gameboard.buildGameBoard();
  }

  function squareClicked() {
    console.log(`clicked ${this.getAttribute('data-id')}`);
  }

  return { 
    gameStart, 
    squareClicked 
  };
})()

PlayGame.gameStart();
