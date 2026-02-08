


export default function GameBoard({onSelectCell, board}) {

    // function handleCellClick(rowIndex, cellIndex) {
    //     setGameBoard(prevGameBoard => {
    //         // since array is a reference type, we need to create a new copy of the 2D array
    //         // to avoid mutating the previous state directly (which is against react's state management principles)
    //         // which may cause unexpected behavior in react's rendering process
    //         const updatedGameBoard = [...prevGameBoard.map(row => [...row])];
    //         updatedGameBoard[rowIndex][cellIndex] = activePlayer;
    //         return updatedGameBoard;
    //     })

    //     onSelectCell();
    // }

    return <ol id="game-board">
        {board.map((row, rowIndex) => <li key={rowIndex}>
            <ol>
                {row.map((playerSymbol, cellIndex) => (
                    <li key={cellIndex} className="game-cell">
                        <button onClick={() => onSelectCell(rowIndex, cellIndex)} disabled={playerSymbol !== null}>
                            {playerSymbol}
                        </button>
                    </li>)
                )}
            </ol>
        </li> )}
    </ol>
}