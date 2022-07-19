import { BN } from 'bn.js';
import styles from '../../../../styles/components/convoy/Item.module.css'

import { getDisplay, EditableDisplay } from '../../../../utils/resources/convoyable';


function toSingleConveyable(conveyables) {
    const values = Array.from(conveyables)[0];
    return { type: values[0], amount: values[1] }
}

export function SpentItem({ params: { outputs, output_index, setOutputs, spendable, setSpendable, conveyables } }) {

    return <div onClick={() => {

    }} className={
        [styles.box, styles.clickable, styles.dark_bg].join(" ")}>

        <div className={styles.content}>
            {
                conveyables.size === 0 ? "empty" : ""
            }

            <div className={styles.content_base}>
                {
                    conveyables.size > 0
                        ? getDisplay(toSingleConveyable(conveyables))
                        : ""
                }
                {
                    conveyables.size > 1
                        ? " + " + (conveyables.size - 1) + " other" + ((conveyables.size > 2) ? "s" : "")
                        : ""

                }
            </div>

            <div className={styles.content_hidden}>
                {
                    Array.from(conveyables).map(([type, amount], id) =>
                        <div className={styles.conveyable_line} key={id}>{conveyables.size === 1 ? "" : "-"} {
                            <EditableDisplay conveyable={{ type, amount }}
                                checkConveyableAmount={
                                    (newAmount) => {
                                        const rest = amount.sub(newAmount);
                                        const val1 = rest.add(spendable.has(type) ? spendable.get(type) : new BN(0))
                                        const val2 = rest.neg().add(outputs[output_index].has(type) ? outputs[output_index].get(type) : new BN(0))
                                        return !(val1.isNeg() || val2.isNeg())
                                    }
                                }
                                updateConveyableAmount={(newAmount) => {
                                    const rest = amount.sub(newAmount);

                                    // 1) add rest to spendable[type]
                                    const newSpendable = new Map(spendable);
                                    newSpendable.set(type, rest.add(newSpendable.has(type) ? newSpendable.get(type) : new BN(0)))
                                    setSpendable(newSpendable)

                                    // 2) substract rest to conveyables[type]
                                    const cloned = new Map(outputs[output_index]);

                                    cloned.set(type, rest.neg().add(cloned.has(type) ? cloned.get(type) : new BN(0)))

                                    const clonedOutputs = [...outputs]
                                    clonedOutputs[output_index] = cloned;

                                    setOutputs(clonedOutputs)
                                    return;
                                }
                                }
                            />
                        }</div>)
                }
            </div>

            <div className={styles.items}>

                <svg className={[styles.icon, styles.clickable].join(" ")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>            </div>

        </div>
    </div>
}


export function ToSpendItem({ conveyables, create }) {

    return <div className={
        [styles.box, styles.dark_bg_disabled].join(" ")}>

        <div className={styles.content}>
            {
                conveyables.size === 0 ? "empty" : ""
            }

            <div className={styles.content_base}>
                {
                    conveyables.size > 0
                        ? getDisplay(toSingleConveyable(conveyables))
                        : ""
                }
                {
                    conveyables.size > 1
                        ? " + " + (conveyables.size - 1) + " other" + ((conveyables.size > 2) ? "s" : "")
                        : ""

                }
            </div>

            <div className={styles.content_hidden}>
                {Array.from(conveyables).map(([type, amount], id) => <div key={id}>{conveyables.size === 1 ? "" : "-"} {getDisplay({ type, amount })}</div>)}
            </div>

            <div className={[styles.items, styles.clickable].join(" ")}>
                <svg onClick={create} className={[styles.icon, styles.highlighted_icon].join(" ")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
            </div>
        </div>
    </div>
}