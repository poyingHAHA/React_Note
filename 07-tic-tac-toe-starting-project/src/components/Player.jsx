import { useState } from "react";

export default function Player({ initialName, symbol, isActive, onChangeName }) {
    const [playerName, setPlayerName] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);

    function handleEditClick() {
        // in react, when updating state based on previous state, use a callback function
        // so that react always has the latest state value, otherwise react may batch multiple state updates together and the previous state value may be stale
        setIsEditing(isEditing => !isEditing); 
        if (isEditing){
            onChangeName(symbol, playerName);  
        }
    }

    function handleNameChange(event) {
        setPlayerName(event.target.value);
    }

    let editableName = <span className="player-name">{playerName}</span>;
    if (isEditing) {
        editableName = <input type="text" required value={playerName} onChange={handleNameChange} />;
    }

    return (
        <li className={isActive ? "active" : undefined}>
            <span className="player">
                {editableName}
                <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
        </li>
    );
}