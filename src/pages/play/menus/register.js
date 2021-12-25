import "./menus.css"

import React, { useState } from 'react';
import { ethers } from "ethers";
import { Spinner } from '../../../components/spinner'


function create(name, contract, setCreatingState, setTxHash) {
    setCreatingState(1);
    (async () => {
        const tx = await contract.register(name, {
            value: ethers.utils.parseEther("10.0")
        });
        setTxHash(tx.hash);
        setCreatingState(2);
    })();
}

function Register({ setGameState, contract }) {
    const [name, setName] = useState("");
    const [creatingState, setCreatingState] = useState(0);
    const [txHash, setTxHash] = useState(null);

    let component;
    switch (creatingState) {

        case 0:
            component = <>
                <h1 className="game register element" >Create a colony</h1>

                <div className="game register text element" >
                    You will get an additional colony consisting of a simple settler camp for 10 CRO.
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
                    <button className="game register button" onClick={() => {
                        setGameState(2);
                    }}>My colonies</button>
                    <button className={"game register button" + ((name) ? "" : " disabled")} onClick={() => {
                        if (name)
                            create(name, contract, setCreatingState, setTxHash);
                    }}>Create</button>
                </div>
            </>
            break;

        case 1:
            component = < >
                <div className="game register text element sign" >Please sign the transaction
                    <button className="game register button" onClick={() => setCreatingState(0)}>Cancel</button>
                </div>
            </>
            break;

        case 2:
            component = <div className="game register minting">

                <div className="game register text element minting" >
                    <Spinner className="game register minting spinner" color={'white'} />
                    Your first colony is being minted
                </div>
                <a className="game register constraint button" href={"https://cronos.crypto.org/explorer/testnet3/tx/" + txHash } target="_blank" rel="noreferrer">Check transaction</a>

                <div className="game register text element" >
                </div>
            </div>
            break;
        default:
            break;

    }


    return <div className="game overlay fadeIn"  >
        <div className="game register box" >{component}</div>
    </div>;
}

export default Register;
