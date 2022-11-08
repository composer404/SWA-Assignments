import React, { useEffect, useState } from "react";

import { getGames } from "../services/game.service";

const Home = () => {

  const [content, setContent] = useState("");

  useEffect(() => {
    getGames().then(
      (response: any) => {
        setContent(response.data);
      },
      (error: any) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
 };

export default Home;