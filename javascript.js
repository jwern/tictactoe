// IIFE initialized immediately; returned methods available for call
const Gameboard = (() => {
  let boardWidth = 3;
  let boardHeight = boardWidth; // Only working with square boards right now, but written with both variables to allow this to change in the future
  let defaultFill = " ";
  let rows;
  let board = document.getElementById('game-board');
  let player1Box = document.getElementById('player-1-inputs');
  let player2Box = document.getElementById('player-2-inputs');
  
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

    player2Box.classList.add('not-current-player');
    board.classList.add('built');
    toggleListeners(addEventListener);
  }

  function squareClicked() {
    // Complete the player's turn and check if the game is over
    let playerTurn = completeTurn(this);
    
    // We only want to invoke the computer's turn if 
    // we're playing against the computer and the game is not over
    if (PlayGame.againstComputer() && !playerTurn) {
      toggleListeners(removeEventListener);
      setTimeout(computerTakeTurn, 1000);
    }

    adjustPlayerBox();
  }

  function computerTakeTurn() {
    // Find all squares without a player marker and select a random one
    let emptySquares = [...board.querySelectorAll('.board-square')].filter(square => square.innerHTML === defaultFill);
    let chosenSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
   
    completeTurn(chosenSquare);
    toggleListeners(addEventListener);
    adjustPlayerBox();
  }

  function completeTurn(pickedSquare) {
    let currentPlayer = PlayGame.getCurrentPlayer();
    // Find the row/column of the square that was clicked (or chosen by computer)
    let row = pickedSquare.getAttribute('data-row');
    let column = pickedSquare.getAttribute('data-column');

    // Check if square is empty (else will apply to player turn only)
    if (rows[row][column] === defaultFill) {
      // Update the rows array with the mark
      rows[row][column] = currentPlayer.mark;
      // Update the square in the DOM with the mark
      pickedSquare.innerText = currentPlayer.mark;
      // Add the player's color to the square
      pickedSquare.classList.add(`${currentPlayer.number}-color`);
       // Check if the game is over via victory or tie
       return checkForWinner(row, column, currentPlayer);
    } else {
      alert("Please pick an empty square");
      return true;
    };
  }

  function adjustPlayerBox() {
    let currentPlayer = PlayGame.getCurrentPlayer();

    if (currentPlayer.number === "player2") {
      player1Box.classList.add('not-current-player');
      player2Box.classList.remove('not-current-player');
    } else {
      player1Box.classList.remove('not-current-player');
      player2Box.classList.add('not-current-player');
    };
  }

  function checkForWinner(row, column, currentPlayer) {
      const checker = line => {
        let lineCheck = new Set(line);
        // Checks if there are any empty squares; 
        // and if not, checks if all squares are the same
        return !lineCheck.has(defaultFill) && lineCheck.size === 1
      }

      // Check if there's a victory across
      if (checker(rows[row])) {
        setTimeout(() => PlayGame.declareWinner(currentPlayer), 0);
        return true;  // If there is a victory, we stop checking other directions
    }

      // Check if there's a victory up-and-down
      let tempColumn = [];
      for (row of rows) {
        tempColumn.push(row[column]);
      }

      if (checker(tempColumn)) {
        setTimeout(() => PlayGame.declareWinner(currentPlayer), 0);
        return true;
      }

      // Check if there's a victory diagonally
      let rightDiagonal = [];
      let leftDiagonal = [];
      for  (x = 0, y = rows.length - 1; x < rows.length; x++, y--) {
        rightDiagonal.push(rows[x][x]);
        leftDiagonal.push(rows[y][x]);
      }

      if (checker(rightDiagonal) || checker(leftDiagonal)) {
        setTimeout(() => PlayGame.declareWinner(currentPlayer), 0);
        return true;
      }

      // Check if the board is filled and there is no winner
      if (!rows.flat().includes(defaultFill)) {
        setTimeout(() => PlayGame.declareWinner(), 0);
        return true;
      }
  }

  function toggleListeners(toggleFunction) {
    let squares = board.querySelectorAll('.board-square');
    squares.forEach(square => toggleFunction.call(square, 'click', squareClicked));
  }

  function setupRematch() {
    while (board.lastChild) {
      board.removeChild(board.lastChild);
    }
    board.removeAttribute('style');
    player1Box.classList.remove('not-current-player');
    player2Box.classList.add('not-current-player');
    buildGameBoard();
  }

  return { 
    getRows, 
    defaultFill,
    buildGameBoard,
    toggleListeners,
    setupRematch
  };
})()

// Factory Function that can be used to create players
const Player = (playerName, playerMark, playerNumber) => {
  let name = checkPlayerName(playerName) || playerName;
  let mark = checkPlayerMarker(playerMark) || playerMark;
  let number = playerNumber;
  let score = 0;

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

  const addVictory = () => score++;
  const getScore = () => score;

  return { name, mark, number, addVictory, getScore };
}

// IIFE initialized immediately; returned methods available for call
const PlayGame = (() => {
  let player1;
  let player2;
  let computer;
  let playerForm = document.getElementById('player-form');
  
  let gameStart = (playerData) => {
    player1 = Player(playerData["player-1-name"], playerData["player-1-marker"], "player1");
    player2 = Player(playerData["player-2-name"], playerData["player-2-marker"], "player2");

    if (playerData["play-with-computer"]) {
      computer = true;
    }
    Gameboard.buildGameBoard();
  }

  playerForm.addEventListener('submit', e => {
    e.preventDefault();
    let playerData = Object.fromEntries(new FormData(e.target).entries());
    let beginGameButton = document.getElementById('form-submit-button');
    let aiButton = document.getElementById('ai-check');

    beginGameButton.classList.toggle('hidden');
    aiButton.classList.toggle('hidden');
    gameStart(playerData);
  })

  const againstComputer = () => computer;

  const getCurrentPlayer = () => {
    if (Gameboard.getRows().flat().filter(item => item !== Gameboard.defaultFill).length % 2 === 0) {
      return player1;
    } else {
      return player2;
    }
  }

  const updateScoreboard = () => {
    let playerOneScore = document.getElementById('player-1-score');
    let playerTwoScore = document.getElementById('player-2-score');

    playerOneScore.value = player1.getScore();
    playerTwoScore.value = player2.getScore();
  }

  const declareWinner = player => {
    if (player) {
      alert(`${player.name} wins!`);
      player.addVictory();
      updateScoreboard();
    } else {
      alert("It's a tie!");
    };

    if (confirm("Play again?")) {
      Gameboard.setupRematch();
    } else {
      Gameboard.toggleListeners(removeEventListener);
      document.querySelector('.not-current-player').classList.remove('not-current-player');
    };
  }

  return { 
    againstComputer,
    gameStart,
    getCurrentPlayer,
    declareWinner
  };
})()