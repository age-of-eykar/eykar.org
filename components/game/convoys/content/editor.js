import gameStyles from '../../../../styles/Game.module.css'
//import styles from '../../../../styles/components/convoy/Editor.module.css'
import footerStyles from '../../../../styles/components/convoy/Footer.module.css'
import EditorItem from './editor_item'
import { useEffect, useState } from "react";
import BN from "bn.js"

export default function ConvoysEditor({ convoys, x, y, setEditing }) {

    const [total, setTotal] = useState(new Map());

    function addToTotal(contents) {
        for (const content of contents) {
            const value = total.get(content.type) || new BN(0);
            total.set(content.type, content.data.add(value));
        }
        setTotal(new Map(total))
    }

    function removeFromTotal(contents) {
        for (const content of contents) {
            const value = total.get(content.type);
            total.set(content.type, value.sub(content.data));
        }
        setTotal(new Map(total))
    }

    useEffect(() => {
        console.log(total)
    }, [total])

    return (
        <>
            <h1 className={gameStyles.bigtitle}>Selecting inputs</h1>

            {convoys.map((convoyId) =>
                <EditorItem convoyId={convoyId} addToTotal={addToTotal} removeFromTotal={removeFromTotal} />
            )}

            <div className={footerStyles.footer} >
                <div onClick={() => setEditing(false)} className={footerStyles.button}>
                    <svg className={footerStyles.button_left_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd"></path></svg>
                    all convoys
                </div>

                <div className={footerStyles.button}>
                    outputs
                    <svg className={footerStyles.button_right_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"></path></svg>
                </div>
            </div>

        </>
    );
}