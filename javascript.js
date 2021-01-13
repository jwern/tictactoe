// IIFE initialized immediately; returned methods available for call
const Gameboard = (() => {
  let boardWidth = 3;
  let boardHeight = boardWidth; // Only working with square boards right now, but written with both variables to allow this to change in the future
  let defaultFill = " ";
  let rows;
  let board = document.getElementById('game-board');
  
  const getRows = () => rows;

  const buildGameBoard = () => {
    rows = [...Array(boardHeight)].map(() => Array(boardWidth).fill(defaultFill));
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

    toggleListeners(addEventListener);
  }

  function squareClicked() {
    let currentPlayer = PlayGame.getCurrentPlayer();
    let arrayRow = this.getAttribute('data-row');
    let arrayColumn = this.getAttribute('data-column');

    if (rows[arrayRow][arrayColumn] === defaultFill) {
      rows[arrayRow][arrayColumn] = currentPlayer.mark;
      this.innerText = currentPlayer.mark;
      this.classList.add(`${currentPlayer.number}-color`);
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
        PlayGame.declareWinner(currentPlayer);
        return; // If there is a victory, we stop checking other directions - technically there could be a dual victory for one player, but we'll add this later
      }

      let tempColumn = [];
      for (row of rows) {
        tempColumn.push(row[column]);
      }

      // Check if there's a victory up-and-down
      if (checker(tempColumn)) {
        PlayGame.declareWinner(currentPlayer);
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
        PlayGame.declareWinner(currentPlayer);
        return;
      }

      // Check if the board is filled and there is no winner
      if (!rows.flat().includes(defaultFill)) {
        alert("It's a tie!");
      }
  }

  function toggleListeners(toggleFunction) {
    let squares = board.querySelectorAll('.board-square');
    squares.forEach(square => toggleFunction.call(square, 'click', squareClicked));
  }

  return { 
    getRows, 
    defaultFill,
    buildGameBoard,
    toggleListeners
  };
})()

// Factory Function that can be used to create players
const Player = (playerName, playerMark, playerNumber) => {
  let name = checkPlayerName(playerName) || playerName;
  let mark = checkPlayerMarker(playerMark) || playerMark;
  let number = playerNumber;

  function checkPlayerName(name) { // Defaults if no name is given
    if (!name.trim()) {
      return (playerNumber === "player1" ? "Player 1" : "Player 2");
    };
  }

  function checkPlayerMarker(marker) { // Defaults if no marker is given
    if (!marker || marker === Gameboard.defaultFill) {
      return (playerNumber === "player1" ? "X" : "O");
    };
  }

  return { name, mark, number };
}

// IIFE initialized immediately; returned methods available for call
const PlayGame = (() => {
  let player1;
  let player2;
  let playerForm = document.getElementById('player-form');
  let beginGameButton = document.getElementById('begin-game-button');
  
  let gameStart = (playerData) => {
    player1 = Player(playerData["player-1-name"], playerData["player-1-marker"], "player1");
    player2 = Player(playerData["player-2-name"], playerData["player-2-marker"], "player2");
    console.log(`The game has begun, ${player1.name} & ${player2.name}`);
    Gameboard.buildGameBoard();
  }

  playerForm.addEventListener('submit', e => {
    e.preventDefault();
    let playerData = Object.fromEntries(new FormData(e.target).entries());
    beginGameButton.classList.toggle('hidden');
    gameStart(playerData);
    // e.target.reset();
  })

  const getCurrentPlayer = () => {
    if (Gameboard.getRows().flat().filter(item => item !== Gameboard.defaultFill).length % 2 === 0) {
      return player1;
    } else {
      return player2;
    }
  }

  const declareWinner = player => {
    alert(`${player.name} wins!`);
    Gameboard.toggleListeners(removeEventListener);
  }

  return { 
    gameStart,
    getCurrentPlayer,
    declareWinner
  };
})()

// PlayGame.gameStart();


// NEXT TO-DO: 
// Let users give names and choose marks
// Allow game restart (allow clear board on victory / tie)

// FUTURE TO-DO:
// Add computer / AI opponent