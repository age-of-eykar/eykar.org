import styles from '../../../styles/components/notifs/Panel.module.css'
import Notif from './notif';
import { useStarknetTransactionManager } from '@starknet-react/core'

export default function Panel({ toggle }) {
    const { transactions } = useStarknetTransactionManager()
    return (
        transactions.length === 0
            ? <div onClick={() => toggle(false)} className={styles.empty}>
                <svg className={styles.empty_icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <div className={styles.message}>You have no pending transactions</div>
            </div>
            : <div className={styles.box}>
                {
                    transactions.map(transaction => {
                        return <Notif key={transaction.transactionHash} transaction={transaction} />;
                    })
                }
            </div>
    );
}
