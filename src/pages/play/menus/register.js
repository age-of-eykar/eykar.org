import "./menus.css"

import React, { useState } from 'react';
import { generateName } from '../../../utils/name';
import { ethers } from "ethers";

async function create(name, contract) {
    await contract.register(name, {
        value: ethers.utils.parseEther("10.0")
    });
}

function Register({ contract }) {
    const [name, setName] = useState(generateName());

    return (
        <div>
            <h1>Register</h1>

            You have no colonies. You can get one for 10 CRO.
            <br />
            How would you call it?
            <input type="text" value={name} onChange={event => {
                setName(event.target.value);
            }} />

            <button onClick={async () => { create(name, contract) }}>Create your colony</button>

        </div>
    );
}

export default Register;
