import "./menus.css"

import React, { useState } from 'react';
import { generateName } from '../../../utils/name';

function Select({ contract, colonies }) {

    const [name, setName] = useState(generateName());
    (async () => { 
        console.log(1);
        console.log(await contract.getPlots(0, 0, 15, 15)); })();

    return (
        <div>
            <h1>Select a colony</h1>

            {
                colonies.map(colony => {
                    return <button key={colony.location} >
                        <h2>{colony.name}</h2>
                        <ol>
                            <li>plots: {colony.plotsAmount.toString()}</li>
                            <li>people: {colony.people.toString()}</li>
                            <li>materials: {colony.materials.toString()}</li>
                            <li>food: {colony.food.toString()}</li>
                        </ol>

                    </button>
                })
            }

        </div>
    );
}

export default Select;
