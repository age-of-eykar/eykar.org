import styles from '../../styles/components/convoy/Item.module.css'
import { useState } from "react";
import BN from "bn.js"

export function getDisplay(conveyable) {
    const types = new Set(['human', 'wood']);

    if (types.has(conveyable.type)) {
        const amount = conveyable.amount.toNumber();
        return amount + " × " + conveyable.type + (amount > 1 ? "s" : "");
    } else {
        return "error, contact a developer";
    }
}

export function EditableDisplay({ conveyable, checkConveyableAmount, updateConveyableAmount }) {

    const types = new Set(['human']);

    if (!types.has(conveyable.type)) {
        return <>"error, contact a developer"</>;
    }

    const [amount, setAmount] = useState(conveyable.amount.toNumber());
    const bnAmount = new BN(amount);

    return <div className={styles.conveyable_line}>

        <div className={styles.conveyable_line_shown}>
            {getDisplay(conveyable)}
        </div>

        <div className={styles.conveyable_line_hidden}>
            <div className={styles.editable_field}>
                <input className={styles.field_input} type="number" value={amount} onChange={(event) => {
                    setAmount(event.target.value)
                }} />
                {
                    /^\d+$/.test(amount) && checkConveyableAmount(bnAmount)
                        ? <svg onClick={() => updateConveyableAmount(bnAmount)} className={styles.validate_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        : <svg className={styles.warning_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                }
            </div>
            <div> × {conveyable.type + (amount > 1 ? "s" : "")}</div>
        </div>
    </div>


}