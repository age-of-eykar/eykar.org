import "./menus.css"

import React, { useState } from 'react';
import { generateName } from '../../../utils/name';
import { getDimensions } from "../../../components/map/grid/gridManager"

function setColony(setGameState, setTopLeft, setBottomRight, colony) {
    (async () => {
        const dimensions = getDimensions({ x: colony.xLocation.toNumber(), y: colony.yLocation.toNumber() }, 32);
        setTopLeft(dimensions.topLeft);
        setBottomRight(dimensions.bottomRight);
        setGameState(3);
    })();
}

function Select({ setGameState, setTopLeft, setBottomRight, colonies }) {

    const [name, setName] = useState(generateName());
    return (
        <div className="game overlay" >
            <h1 className="game title" >Chose a colony</h1>
            <div className="game colonies">
                {
                    colonies.map(colony => {
                        return <button className="game colony box" key={colony.location} onClick={
                            () => setColony(setGameState, setTopLeft, setBottomRight, colony)} >
                            <h2 className="game colony">{colony.name}</h2>
                            <div className="game colony content">
                                <div>🏛️ Plots: {colony.plotsAmount.toString()}</div>
                                <div>🧑‍🌾 People: {colony.people.toString()}</div>
                                <div>🪵 Materials: {colony.materials.toString()}</div>
                                <div>🥕 Food: {colony.food.toString()}</div>
                            </div>

                        </button>
                    })
                }

                <button className="game colony box create" key="buy" onClick={
                    () => setGameState(1)} >
                    <h2 className="game colony">💰 Buy a colony</h2>
                    <div className="game colony content">
                        Create a new colony for 10 CRO
                    </div>

                </button>
            </div>
        </div>
    );
}

export default Select;
