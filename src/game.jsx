import React, { useState, useEffect } from 'react';
import './App.css';

const BottleCatcherGame = () => {
    const [bottles, setBottles] = useState([]);
    const [position, setPosition] = useState(50);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setBottles((prevBottles) => [
                    ...prevBottles,
                    { id: Date.now(), left: Math.random() * 90, top: 0 },
                ]);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [isPaused]);

    useEffect(() => {
        if (!isPaused) {
            const moveBottles = setInterval(() => {
                setBottles((prevBottles) =>
                    prevBottles.map((bottle) => ({
                        ...bottle,
                        top: bottle.top + 2,
                    }))
                );
            }, 100);

            return () => clearInterval(moveBottles);
        }
    }, [isPaused]);

    useEffect(() => {
        if (!isPaused) {
            const checkCollision = () => {
                setBottles((prevBottles) => {
                    return prevBottles.filter((bottle) => {
                        if (bottle.top > 90) {
                            if (Math.abs(bottle.left - position) < 10) {
                                setScore((prevScore) => prevScore + 1);
                                return false;
                            } else {
                                setLives((prevLives) => {
                                    const newLives = prevLives - 1;
                                    if (newLives > 0) {
                                        setIsPaused(true);
                                    }
                                    return newLives;
                                });
                                return false;
                            }
                        }
                        return true;
                    });
                });
            };

            const collisionInterval = setInterval(checkCollision, 100);

            return () => clearInterval(collisionInterval);
        }
    }, [position, isPaused]);

    const moveLeft = () => {
        setPosition((prevPosition) => Math.max(prevPosition - 10, 0));
    };

    const moveRight = () => {
        setPosition((prevPosition) => Math.min(prevPosition + 10, 90));
    };

    const handleNextLife = () => {
        setIsPaused(false);
    };

    if (lives <= 0 && !isPaused) {
        return <div className="game-over">Game Over! Your score: {score}</div>;
    }

    if (isPaused) {
        return (
            <div className="pause-screen">
                <div>You lost a life! Lives left: {lives}</div>
                <button onClick={handleNextLife}>Use Next Life</button>
            </div>
        );
    }

    return (
        <div className="game-container">
            <div className="score">Score: {score}</div>
            <div className="lives">Lives: {lives}</div>
            <div className="catcher" style={{ left: `${position}%` }}></div>
            {bottles.map((bottle) => (
                <div
                    key={bottle.id}
                    className="bottle"
                    style={{ left: `${bottle.left}%`, top: `${bottle.top}%` }}
                ></div>
            ))}
            <div className="controls">
                <button onClick={moveLeft}>Left</button>
                <button onClick={moveRight}>Right</button>
            </div>
        </div>
    );
};

export default BottleCatcherGame;
