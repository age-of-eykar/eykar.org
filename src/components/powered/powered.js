

import "./powered.css"

import logo from "../../img/cronos_logo.svg";

function Powered() {
    return (
        <div className="powered setup">
            <a>
                <img className="powered logo" src={logo} alt="Cronos Logo" />
                <span className="powered text" >Powered by cronos</span>
            </a>
        </div>
    );

}
export default Powered;
