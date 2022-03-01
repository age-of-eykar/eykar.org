import { useState, useEffect } from "react";
import debounce from "debounce";
import PlayHeader from "../../components/header/playheader";
import MapCanvas from "../../components/map/map";
import { Spinner } from "../../components/spinner";
import PlotBox from "../../components/plotBox/plotBox";
import Select from "./menus/select";
import Register from "./menus/register";
import { getDimensions } from "../../utils/gridManager";
import { szudzik } from "../../utils/deterministic.js";
import "./play.css";

function Play() {

  return (
    <div className="game screen">
      <div className="game interactive">
        <PlayHeader gameState={0} setGameState={() => { }} />
        <MapCanvas setClickedPlotCallback={() => { }} />
      </div>
    </div>
  );
}
export default Play;