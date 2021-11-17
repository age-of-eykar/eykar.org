import React from "react";
import "./card.css";

function cellCard({ cellNumber, coord, coordinatesPerId, biome }) {
  const trueCoords = coordinatesPerId.get(cellNumber)
  let x = 0, y = 0;
  if (typeof trueCoords !== 'undefined') {
    x = trueCoords[0]
    y = trueCoords[1]
  }

  return (
    <div className="cell_card">
      <div className="cell_card_body">
        <p>Cell number: {cellNumber}</p>
        <p>
          Screen coordinates: {coord.x}, {coord.y}
        </p>
        <p>
          True coordinates: {x}, {y}
        </p>
        <p>Biome: {biome[2]}</p>
        <p>Temperatue: {Math.floor(biome[0])}</p>
        <p>Elevation: {Math.floor(biome[1])}</p>
      </div>
    </div>
  );
}

export default cellCard;