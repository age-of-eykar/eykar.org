

import "./powered.css"

import logo from "../../img/starknet_logo.svg";

function Powered() {
    return (
        <div className="powered setup">
            <a className="powered layout" href="https://starknet.io/" target="_blank" rel="noreferrer" >
                <img className="powered logo" src={logo} alt="StarkNet Logo" />
                <span className="powered text" >Powered by StarkNet</span>
            </a>
        </div>
    );

}
export default Powered;
