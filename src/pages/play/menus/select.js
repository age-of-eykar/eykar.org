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
        <div>
            <h1>Select a colony</h1>
            {
                colonies.map(colony => {
                    return <button key={colony.location} onClick={
                        () => setColony(setGameState, setTopLeft, setBottomRight, colony)} >
                        <h2>{colony.name}</h2>
                        <ol>
                            <li key="plots" >plots: {colony.plotsAmount.toString()}</li>
                            <li key="people" >people: {colony.people.toString()}</li>
                            <li key="materials" >materials: {colony.materials.toString()}</li>
                            <li key="food">food: {colony.food.toString()}</li>
                        </ol>

                    </button>
                })
            }

        </div>
    );
}

export default Select;
