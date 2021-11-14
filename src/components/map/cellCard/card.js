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
        <p>Cell number: {cellNumber}</p>
        <p>
          Screen coordinates: {coord.x}, {coord.y}
        </p>
        <p>True coordinates: {x}, {y} </p>
      </div>
    </div>
  );
}

export default cellCard;
