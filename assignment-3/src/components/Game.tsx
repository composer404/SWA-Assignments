import { clearCurrentGame, clearSelection, createBoard, selectFirstItem, selectSecondItem } from '../actions/game'
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { Navigate } from 'react-router-dom';

const Game = () => {
    const dispatch = useDispatch();

    const { board, firstItem, generator, points, gameId } = useSelector((state: any) => { return state.game}, shallowEqual);
    const { isLoggedIn, user } = useSelector((state: any) => state.auth);

    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    const handleCreateBoard = (clearCurrent: boolean) => {
        dispatch((createBoard(user.userId, gameId, clearCurrent)) as any)
    };

    const handleClearSelection = () => {
        dispatch((clearSelection(gameId)) as any)
    }

    const handleSelecteItem = (item: any) => {
        if (!firstItem) {
            dispatch((selectFirstItem(item, gameId)) as any)
            return;
        }

        dispatch((selectSecondItem(board, generator, firstItem, item, gameId, points)) as any)
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
            {gameId && (
                 <button className='btn btn-primary m-2' onClick={() => handleCreateBoard(false)}>Continue</button>
            )}
            <button className='btn btn-primary m-2' onClick={() => handleCreateBoard(true)}>Generate board</button>
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