import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import debounce from "debounce";
import { Contract } from "@ethersproject/contracts";
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
  const [key, setKey] = useState(0);
  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const { library, account } = useWeb3React();
  if (library === undefined) window.location.href = "/";
  const [contract, setContract] = useState(undefined);
  const [gameState, setGameState] = useState(0);
  const [colonies, setColonies] = useState(undefined);
  const [bottomRight, setBottomRight] = useState(dimensions.bottomRight);
  const [topLeft, setTopLeft] = useState(dimensions.topLeft);
  const [activePlots, setActivePlots] = useState(new Map());
  const [clickedPlot, setClickedPlotCallback] = useState(undefined);
  const [clickedPlotContractData, setClickedPlotContractData] = useState(undefined);

  useEffect(() => {
    const { abi } = require("../../contracts/Eykar.json");
    const loadedContract = new Contract(
      "0x40B24f2A0F58E050233A3C19eb42f297df069bB8",
      abi,
      library.getSigner(account)
    );
    setContract(loadedContract);
    (async () => {
      setColonies(await loadedContract.getColonies(account));
    })();
    const onBlock = () =>
      (async () => {
        const newColonies = await loadedContract.getColonies(account);
        if (colonies === undefined || newColonies.length !== colonies.length) {
          setColonies(newColonies);
        }
      })();

    library.on("block", onBlock);
    return () => {
      library.removeListener("block", onBlock);
    };
  }, [library, account]);

  useEffect(() => {
    if (gameState === 3) {
      (async () => {
        // TODO See if we can simplify the function without a setBottomright and SetTopLeft variables
        const startX = Math.trunc(topLeft.x / 8);
        const startY = Math.trunc(topLeft.y / 8);
        const endX = Math.trunc(bottomRight.x / 8) + 1;
        const endY = Math.trunc(bottomRight.y / 8) + 1;
        for (let i = startX; i < endX; i++)
          for (let j = startY; j < endY; j++) {
            const output = await contract.getPlots(i, j);
            for (let k = 0; k < output.plots.length; k++)
              activePlots.set(szudzik(output.xArray[k], output.yArray[k]), output.plots[k]);
          }
        setActivePlots(activePlots);
      })();
    }
  }, [gameState]);

  useEffect(() => {
    if (colonies === undefined) return;
    if (colonies.length === 0) setGameState(1);
    else if (gameState < 2) setGameState(2);
  }, [colonies]);

  useEffect(() => {
    const handler = debounce(() => setKey((oldValue) => oldValue + 1), 20);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  });

  useEffect(() => {
    (async () => {
      if (contract !== undefined && clickedPlot !== undefined) {
        const plot = await contract.getPlot(clickedPlot.coord.x, clickedPlot.coord.y);
        console.log("plot: " + plot);
        setClickedPlotContractData(plot);
      }
    })();
  }, [contract, clickedPlot]);

  let component;
  switch (gameState) {
    case 0:
      component = (
        <div className="game overlay fadeIn">
          <h1 className="game title">Loading...</h1>
          <Spinner color={"white"} className="game loading" />
        </div>
      );
      break;

    case 1:
      component = <Register setGameState={setGameState} contract={contract} />;
      break;

    case 2:
      component = (
        // TODO see if we can remove setTopLeft and setBottomRight args
        <Select
          setGameState={setGameState}
          setTopLeft={setTopLeft}
          setBottomRight={setBottomRight}
          contract={contract}
          colonies={colonies}
        />
      );
      break;

    case 3:
      if (clickedPlot !== undefined)
        component = <PlotBox
          clickedPlot={clickedPlot}
          clickedPlotContractData={clickedPlotContractData} />;
      break;
    default:
      break;
  }
  return (
    <div className="game screen">
      <div className="game interactive">
        <PlayHeader gameState={gameState} setGameState={setGameState} />
        <MapCanvas setClickedPlotCallback={setClickedPlotCallback} />
        {component}
      </div>
    </div>
  );
}
export default Play;