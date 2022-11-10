import { useDispatch, useSelector } from "react-redux";

import { Navigate } from "react-router-dom";
import { getAllGames } from "../actions/game";
import { useEffect } from 'react';

const Leaderboard = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state: any) => state.auth);
    const { games } = useSelector((state: any) => state.game);
  
    useEffect(() => {
        dispatch(getAllGames() as any);
    });

    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    const renderUserScores = () => {
        if(!games?.length) {
            return;
        }

        const filteredGames = games.filter((game: any) => {
            return game.completed && game.user === user.userId;
        }).sort((a: any, b: any) => {
            return b.score - a.score;
        }).slice(0, 3);


        const gamesToDisaply = [];
            for(let i = 0 ; i <filteredGames.length; i++) {
                gamesToDisaply.push(
                    <div className="score-card"  key={"global-score" + i}>
                        <div>Game ID: {filteredGames[i].id}</div>
                        <div>SCORE: {filteredGames[i].score}</div>
                        <div>USER: {filteredGames[i].user}</div>
                    </div>)
            }
            return gamesToDisaply;
    }

    const renderGlobalLeaders = () => {
            if(!games?.length) {
                dispatch(getAllGames() as any);
                return;
            }
            const filteredGames = games.filter((game: any) => {
                return game.completed;
            }).sort((a: any, b: any) => {
                return b.score - a.score;
            }).slice(0, 10);

            const gamesToDisaply = [];
            for(let i = 0 ; i <filteredGames.length; i++) {
                gamesToDisaply.push(
                    <div className="score-card"  key={"global-score" + i}>
                        <div>Game ID: {filteredGames[i].id}</div>
                        <div>SCORE: {filteredGames[i].score}</div>
                        <div>USER: {filteredGames[i].user}</div>
                    </div>)
            }
            return gamesToDisaply;
    }
  
    return (
        <div className="leaderboard">
            <div className="leaderboard-column">
                <div className="title">User best scores</div>
                {games?.length && renderUserScores()}
                {!games?.length && (
                    <div>
                        No data
                        </div>
                )}
            </div>
            
            <div className="leaderboard-column">
                <div className="title">Best scores in total</div>
                {games?.length && renderGlobalLeaders()}
                {!games?.length && (
                    <div>
                        No data
                        </div>
                )}
            </div>
        </div>
    )
}

export default Leaderboard;