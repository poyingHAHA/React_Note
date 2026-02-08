export default function Log({ turns }) {
    
    
    return <ol id="log">
        {
            turns.map((turn, index) => {
                const { row, col } = turn.cell;
                return <li key={`${row}-${col}`}>Player {turn.player} selected cell ({row}, {col})</li>;
            })
        }
    </ol>
}