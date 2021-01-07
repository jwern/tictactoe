// IIFE initialized immediately
const Gameboard = (() => {
  // let rows = [
  //   ["x", "o", "x"],
  //   ["o", "x", "o"],
  //   [" ", "o", "o"]
  // ];
  let rows = [...Array(3)].map(() => Array(3).fill("x"));

  const buildGameBoard = () => {
    let board = document.getElementById('game-board');
    for (row of rows) {
      let rowIndex = rows.indexOf(row);
      row.forEach((item, index) => {
        let square = document.createElement('div');
        square.classList.add('board-square');
        square.setAttribute('data-id', `${rowIndex}-${index}`);
        square.innerText = item;
        board.append(square);
      })
    }
  }
  return { 
    rows, 
    buildGameBoard 
  };
})()

// Factory Function that can be used to create players
const Player = playerName => {
  let name = playerName;
  return { name };
}

const PlayGame = (() => {
  // let player1 = Player(prompt("Who is player 1?"));
  // let player2 = Player(prompt("And player 2?"));
  let player1 = { name: "Me" };
  let player2 = { name: "You" };
  let gameStart = () => {
    console.log(`The game has begun, ${player1.name} & ${player2.name}`);
    Gameboard.buildGameBoard();
  }
  return { gameStart };
})()

PlayGame.gameStart();
