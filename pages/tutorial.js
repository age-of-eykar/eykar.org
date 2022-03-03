import styles from '../styles/Game.module.css'
import { useStarknet } from '@starknet-react/core'
import MapCanvas from "../components/map/canvas";

export default function Tutorial() {
    const { account, hasStarknet, connectBrowserWallet, library, error } = useStarknet()

    console.log(account)

    return (
        <>
            <h1>Welcome {account}</h1>
            <MapCanvas setClickedPlotCallback={() => { }} />
        </>
    );
}

