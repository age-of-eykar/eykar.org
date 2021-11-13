import React from "react";
import "./card.css";

function cellCard({ cellNumber, coord, coordinatesPerId }) {
  const trueCoords = coordinatesPerId.get(cellNumber)
  let x = 0, y = 0;
  if (typeof trueCoords !== 'undefined') {
    x = trueCoords[0]
    y = trueCoords[1]
  }

  return (
    <div className="card">
      <div className="card-body">
        <p>Structure:</p>
        <p>Numero cellule: {cellNumber}</p>
        <p>
          Coordonnées écran: {coord.x}, {coord.y}
        </p>
        <p>Coordonnées réelles: {x}, {y} </p>
      </div>
    </div>
  );
}

export default cellCard;
