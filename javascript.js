// IIFE initialized immediately
const Gameboard = (() => {
  let rows = [
    ["x", "o", "x"],
    ["o", "x", "o"],
    [" ", "o", "o"]
  ];
  return { rows };
})()

// Factory Function that can be used to create players
const Player = playerName => {
  let name = playerName;
  return { name };
}

const PlayGame = (() => {
  // let player1 = Player(prompt("Who is player 1?"));
  // let player2 = Player(prompt("And player 2?"));
  let player1 = "Me";
  let player2 = "You";
  let gameStart = console.log(player1.name, player2.name);
  return { gameStart };
})()

PlayGame.gameStart;