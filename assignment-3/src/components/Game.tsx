// import { useStore } from "react-redux";

import { clearSelection, createBoard, selectFirstItem, selectSecondItem } from '../actions/game'
import { useDispatch, useSelector } from "react-redux";

const Game = () => {
    const dispatch = useDispatch();

    const { board, firstItem, generator, points } = useSelector((state: any) => {
        return state.game;
    });

    const handleCreateBoard = () => {
        dispatch((createBoard()) as any)
    };

    const handleClearSelection = () => {
        dispatch((clearSelection()) as any)
    }

    const handleSelecteItem = (item: any) => {
        if (!firstItem) {
            dispatch((selectFirstItem(item)) as any)
            return;
        }

        dispatch((selectSecondItem(board, generator, firstItem, item)) as any)
    }

    const isSelectedElement = (element: any) => {
        if (firstItem?.position.col === element.position.col && firstItem?.position.row === element.position.row) {
            return true;
        }
    }

    const renderRow = (elements: any[]) => {
        const rowToDisaply = [];

        for(let i = 0 ; i < elements.length; i++) {
            let selectedStyle = ``;
            const style = {
                backgroundColor: elements[i].value,
            };

            if (isSelectedElement(elements[i])) {
                selectedStyle = `board-item-selected`;
            }

            rowToDisaply.push(<td onClick={() => handleSelecteItem({ ...elements[i]})} key={i} className={"board-item " + selectedStyle} style={style}></td>)
        }
        return rowToDisaply;
    }

    const renderBoard = () => {
        if(!board) {
            return;
        }
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
        return boardToDisplay;
    }

    return (
        <div>
            <button className='btn btn-primary m-2' onClick={handleCreateBoard}>Generate board</button>
            <button className='btn btn-primary m-2' onClick={handleClearSelection}>Clear selection</button>
            <div>Points {points}</div>
            <table>
                <tbody>
                    {renderBoard()}
                </tbody>
            </table>
        </div>
    );
}

export default Game;