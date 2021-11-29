import camp from "../../img/camp.png";
import undiscovered from "../../img/undiscovered.jpg";
import hamlet from "../../img/hamlet.jpg";
import town from "../../img/town.jpg";
import logo from "../../img/logo.svg";
import "./plotBox.css";

export default function PlotBox({ plotInfo, plot }) {
  let source, structure;
  if (plot === null) {
    source = logo;
    structure = "";
  } else {
    switch (plot.structure) {
      case 0:
        source = undiscovered;
        structure = "Undiscovered";
        break;
      case 1:
        source = camp;
        structure = "Camp";
        break;
      case 2:
        source = hamlet;
        structure = "Hamlet";
        break;
      case 3:
        source = town;
        structure = "Town";
        break;
      default:
        source = undiscovered;
        structure = "Undiscovered";
        break;
    }
  }

  return (
    <div className="plotBox">
      <img className="plotBox__image" src={source} alt="Plot" />
      <div className="plotBox__body">
        <p className="structure">{structure}</p>
        <p className="info">Biome: {plotInfo.biome}</p>
        <p className="info">Temperature: {Math.floor(plotInfo.temperature)}</p>
        <p className="info">Elevation: {Math.floor(plotInfo.elevation)}</p>
      </div>
    </div>
  );
}
