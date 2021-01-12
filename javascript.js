// IIFE initialized immediately; returned methods available for call
const Gameboard = (() => {
  let boardWidth = 3;
  let boardHeight = boardWidth; // Only working with square boards right now, but written with both variables to allow this to change in the future
  let defaultFill = " ";
  let rows = [...Array(boardHeight)].map(() => Array(boardWidth).fill(defaultFill));

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
    let currentPlayer = PlayGame.getCurrentPlayer();
    let arrayRow = this.getAttribute('data-row');
    let arrayColumn = this.getAttribute('data-column');

    if (rows[arrayRow][arrayColumn] === defaultFill) {
      rows[arrayRow][arrayColumn] = currentPlayer.mark;
      this.innerText = currentPlayer.mark;
      checkForWinner(arrayRow, arrayColumn, currentPlayer);
    } else {
      alert("Pick an empty square");
    };
  }

  function checkForWinner(row, column, currentPlayer) {
      const checker = line => {
        let lineCheck = new Set(line);
        // Checks if there are any empty squares; 
        // and if not, checks if all squares are the same
        return !lineCheck.has(defaultFill) && lineCheck.size === 1;
      }

      // Check if there's a victory across
      if (checker(rows[row])) {
        console.log("Winner across!", `Congrats ${currentPlayer.name}`);
        return; // If there is a victory, we stop checking other directions - technically there could be a dual victory for one player, but we'll add this later
      }

      let tempColumn = [];
      for (row of rows) {
        tempColumn.push(row[column]);
      }

      // Check if there's a victory up-and-down
      if (checker(tempColumn)) {
        console.log("Winner up and down!", `Congrats ${currentPlayer.name}`);
        return;
      }

      let rightDiagonal = [];
      let leftDiagonal = [];
      for  (x = 0, y = rows.length - 1; x < rows.length; x++, y--) {
        rightDiagonal.push(rows[x][x]);
        leftDiagonal.push(rows[y][x]);
      }

      // Check if there's a victory diagonally
      if (checker(rightDiagonal) || checker(leftDiagonal)) {
        console.log("Winner diagonally!");
        return;
      }
  }

  return { 
    rows, 
    defaultFill,
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
    if (Gameboard.rows.flat().filter(item => item !== Gameboard.defaultFill).length % 2 === 0) {
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


// NEXT TO-DO: 
// Add check for tie (board is full and there are no winners)
// End game when victory or tie condition is met:  1) Declare winner, 2) Remove eventListeners from squares so you can't keep

// FUTURE TO-DO:
// Let users give names and choose marks
// Allow game restart (allow clear board on victory / tie)
// Add colors to squares