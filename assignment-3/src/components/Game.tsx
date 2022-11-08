// import { useStore } from "react-redux";

import { useDispatch, useSelector } from "react-redux";

import { createBoard } from '../actions/game'

const Game = () => {
    const dispatch = useDispatch();

    const { board } = useSelector((state: any) => {
        return state.game;
    });

    const handleCreateBoard = () => {
        dispatch((createBoard()) as any)
    };

    const renderRow = (elements: any[]) => {
        const rowToDisaply = [];

        for(let i = 0 ; i < elements.length; i++) {
            rowToDisaply.push(<td key={i}>{elements[i].value}</td>)
        }

        return rowToDisaply;
    }

    const renderBoard = () => {
        const rows = [];
        const boardToDisplay = [];

        for (let i = 0; i < board.pieces.length; i +=  board.width) {
            rows.push(board.pieces.slice(i, i +  board.width));
        }

        for(let i = 0; i < rows.length; i++) {
            boardToDisplay.push(<tr key={"row" + i}>
                {renderRow(rows[i])}
            </tr>);
        }

        console.log(`boardtodisplay`, boardToDisplay);
        return boardToDisplay;
    }

    return (
        <div>
            <button onClick={handleCreateBoard}>Generate board</button>
            <div>Game</div>
            <table>
                <tbody>
                    {board && renderBoard()}
                </tbody>
            </table>
        </div>
    );
}

export default Game;