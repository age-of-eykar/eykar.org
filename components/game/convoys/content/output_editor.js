import gameStyles from '../../../../styles/Game.module.css'
import footerStyles from '../../../../styles/components/convoy/Footer.module.css'
import { useEffect, useState } from "react";
import { SpentItem, ToSpendItem } from './output_items';

export default function OutputEditor({ inputs, setInputsMenu, confirm }) {

    const [spendable, setSpendable] = useState(new Map());
    const [outputs, setOutputs] = useState([]);

    useEffect(() => {
        setSpendable(new Map(inputs))
        setOutputs(new Array())
    }, [inputs])

    return (
        <>
            <h1 className={gameStyles.bigtitle}>Allocating outputs</h1>

            {outputs.map((conveyables, output_index) => {
                return <SpentItem params={{outputs, output_index, setOutputs, spendable, setSpendable, conveyables}} />
            }
            )}

            {spendable.size === 0 ? null :
                <ToSpendItem conveyables={spendable} create={() => {
                    const clone = [...outputs];
                    clone.push(new Map(spendable))
                    setOutputs(clone)
                    setSpendable(new Map())
                }} />}

            <div className={footerStyles.footer} >
                <div onClick={setInputsMenu} className={footerStyles.button}>
                    <svg className={footerStyles.button_left_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd"></path></svg>
                    select inputs
                </div>

                <div onClick={
                    () => {
                        if (spendable.size === 0)
                            confirm()
                    }
                } className={footerStyles.button + " " + (spendable.size !== 0 ? footerStyles.disabled : "")}>
                    confirm
                    <svg className={footerStyles.button_right_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path></svg>
                </div>
            </div>

        </>
    );
}