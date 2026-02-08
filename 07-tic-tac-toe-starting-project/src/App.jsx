import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { useState } from "react";
import {WINNING_COMBINATIONS} from "./winning_comb";
import { use } from "react";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

function getActivePlayer(gameTurns) {
  let currentPlayer = 'X';
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function App() {
  const [playerNames, setPlayerNames] = useState({
    'X': 'Player 1',
    'O': 'Player 2'
  });
  const [gameTurns, setGameTurns] = useState([]);
  // manage as little state as possible and derive or compute values as needed
  // const [activePlayer, setActivePlayer] = useState("X");
  const activePlayer = getActivePlayer(gameTurns);
  // make a deep copy of the initial game board
  let gameBoard = [...initialGameBoard.map(row => [...row])];

  for (const turn of gameTurns) {
    const { row, col } = turn.cell;
    gameBoard[row][col] = turn.player;
  }

  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const firstCell = gameBoard[combination[0].row][combination[0].col];
    const secondCell = gameBoard[combination[1].row][combination[1].col];
    const thirdCell = gameBoard[combination[2].row][combination[2].col];
    if (firstCell && firstCell === secondCell && firstCell === thirdCell) {
      winner = playerNames[firstCell];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectCell(row, col) {
    // setActivePlayer(prevPlayer => (prevPlayer === "X" ? "O" : "X"));
    setGameTurns(preTurns => {
      const currentPlayer = getActivePlayer(preTurns);
      // The reason we don't use activePlayer directly here is that
      // setState is asynchronous, so activePlayer may not have updated yet
      // when this function runs. Thus, we determine the current player
      // based on the previous turns.
      const updatedTurns = [{ cell: { row, col }, player: currentPlayer },
      ...preTurns];

      return updatedTurns;
    });
  }

  function handleRestartGame() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayerNames(prevNames => ({
      ...prevNames,
      [symbol]: newName // [symbol] is a computed property name
    }));
  }
  
  return <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        <Player initialName="Player 1" symbol="X" isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange} />
        <Player initialName="Player 2" symbol="O" isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange} />
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestartGame} />}
      <GameBoard onSelectCell={handleSelectCell} board={gameBoard} />
    </div>
    <Log turns={gameTurns} />
  </main>;
}

export default App
