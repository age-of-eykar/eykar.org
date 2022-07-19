
//import styles from '../../../../styles/components/convoy/Editor.module.css'
import InputEditor from './input_editor';
import OutputEditor from './output_editor';
import { useState } from "react";

export default function ConvoysEditor({ convoys, x, y, setEditing }) {

    const [menu, setMenu] = useState("input");
    const [inputsIds, setInputsIds] = useState([]);
    const [inputs, setInputs] = useState(new Map());

    let component;
    if (menu === "input")
        component = <InputEditor
            inputsIds={inputsIds}
            setInputsIds={setInputsIds}
            convoys={convoys}
            total={inputs}
            setTotal={setInputs}
            setEditing={setEditing}
            setOutputMenu={() => setMenu("output")} />
    else if (menu === "output")
        component = <OutputEditor
            inputs={inputs}
            inputsIds={inputsIds}
            setInputsMenu={() => {
                setMenu("input")
                setInputs(new Map())
            }} />
    else
        component = <></>

    return component;
}