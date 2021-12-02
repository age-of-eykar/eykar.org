import camp from "../../img/camp.png";
import undiscovered from "../../img/undiscovered.jpg";
import hamlet from "../../img/hamlet.jpg";
import town from "../../img/town.jpg";
import "./plotBox.css";

export default function PlotBox({ plotInfo, plot }) {
  let source, structure;

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

  return (
    <div className="plotBox box">
      <img className="plotBox image" src={source} alt="Plot" />
      <div className="plotBox body">
        <h1 className="plotBox structure">{structure}</h1>
        <p className="plotBox info">
          Biome: <span className="plotBox result">{plotInfo.biome}</span>
          <br />
          Temperature:{" "}
          <span className="plotBox result">
            {Math.floor(plotInfo.temperature)}
          </span>
          <br />
          Elevation:{" "}
          <span className="plotBox result">
            {Math.floor(plotInfo.elevation)}
          </span>
        </p>
      </div>
    </div>
  );
}
