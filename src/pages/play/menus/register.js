import "./menus.css"

import React, { useState } from 'react';
import { generateName } from '../../../utils/name';
import { ethers } from "ethers";


function create(name, contract, setCreatingState) {
    setCreatingState(1);
    (async () => {
        await contract.register(name, {
            value: ethers.utils.parseEther("10.0")
        });
        setCreatingState(2);
    })();
}

function Register({ setGameState, contract }) {
    const [name, setName] = useState("");
    const [creatingState, setCreatingState] = useState(0);

    let component;
    switch (creatingState) {

        case 0:
            component = <div className="game register box" >
                <h1 className="game register element" >Create a colony</h1>

                <div className="game register text element" >
                    You will get an additional colony consisting of a simple settler camp for 10 CRO.
                    <br />

                </div>
                <div className="game register group">
                    <input className="game register text" type="text" required value={name} onChange={event => {
                        setName(event.target.value)
                    }} />
                    <span className="game register highlight"></span>
                    <span className="game register bar"></span>
                    <label className="game register">How would you call it? </label>
                </div>

                <div className="game register buttons">
                    <button className="game register" onClick={() => {
                        setGameState(2);
                    }}>My colonies</button>
                    <button className={"game register" + ((name) ? "" : " disabled")} onClick={() => {
                        if (name)
                            create(name, contract, setCreatingState);
                    }}>Create</button>
                </div>
            </div>
            break;

        case 1:
            component = <>Please sign the transaction
                <button onClick={() => setCreatingState(0)}>Cancel</button>
            </>
            break;

        case 2:
            component = <>Your first colony is being minted
                <button onClick={() => setCreatingState(0)}>See transaction</button>
            </>;
            break;


    }


    return <div className="game overlay fadeIn"  >{component}</div>;
}

export default Register;
