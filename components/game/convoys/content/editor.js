
//import styles from '../../../../styles/components/convoy/Editor.module.css'
import InputEditor from './input_editor';
import OutputEditor from './output_editor';
import { useState } from "react";

export default function ConvoysEditor({ convoys, x, y, setEditing }) {

    const [menu, setMenu] = useState("input");
    const [inputs, setInputs] = useState(new Map());

    let component;
    if (menu === "input")
        component = <InputEditor convoys={convoys} total={inputs} setTotal={setInputs} setEditing={setEditing} setOutputMenu={() => setMenu("output")} />
    else if (menu === "output")
        component = <OutputEditor inputs={inputs}
            setInputsMenu={() => {
                setMenu("input")
                setInputs(new Map())
            }}
            confirm={() => { }} />
    else
        component = <></>

    return component;
}