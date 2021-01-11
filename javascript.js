// IIFE initialized immediately; returned methods available for call
const Gameboard = (() => {
  // let rows = [
  //   ["x", "o", "x"],
  //   ["o", "x", "o"],
  //   [" ", "o", "o"]
  // ];
  let boardWidth = 3;
  let boardHeight = 3;
  let rows = [...Array(boardHeight)].map(() => Array(boardWidth).fill(" "));

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
        // Sets two data attributes that match the location in our nested rows array
        square.setAttribute('data-row', `${rowIndex}`);
        square.setAttribute('data-column', `${index}`);
        square.innerText = item;
        board.append(square);
      })
    }

    const setupListeners = (() => {
      let squares = board.querySelectorAll('.board-square');
      squares.forEach(square => square.addEventListener('click', squareClicked));
    })()
  }

  function squareClicked() {
    let squareMark = PlayGame.getCurrentPlayer().mark;
    rows[this.getAttribute('data-row')][this.getAttribute('data-column')] = squareMark;
    this.innerText = squareMark;

    console.log(rows);
  }

  return { 
    rows, 
    buildGameBoard,
  };
})()

// Factory Function that can be used to create players
const Player = (playerName, playerMark) => {
  let name = playerName;
  let mark = playerMark;
  return { name, mark };
}

// IIFE initialized immediately; returned methods available for call
const PlayGame = (() => {
  // let player1 = Player(prompt("Who is player 1?"));
  // let player2 = Player(prompt("And player 2?"));
  let player1 = Player("Me", "X");
  let player2 = Player("You", "O");

  let gameStart = () => {
    console.log(`The game has begun, ${player1.name} & ${player2.name}`);
    Gameboard.buildGameBoard();
  }

  const getCurrentPlayer = () => {
    // console.log(Gameboard.rows.flat().filter(item => item !== " ").length);
    if (Gameboard.rows.flat().filter(item => item !== " ").length % 2 === 0) {
      return player1;
    } else {
      return player2;
    }
  }

  return { 
    gameStart,
    getCurrentPlayer
  };
})()

PlayGame.gameStart();
