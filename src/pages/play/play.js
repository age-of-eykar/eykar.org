import "./play.css";
import { useEffect, useState } from "react";
import debounce from "debounce";
import { getDimensions } from "../../components/map/grid/gridManager";
import PlayHeader from "../../components/header/playheader";
import MapCanvas from "../../components/map/map";
import Select from "./menus/select";
import { Spinner } from "../../components/spinner";
import PlotBox from "../../components/plotBox/plotBox";
import Register from "./menus/register";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { szudzik } from "../../utils/deterministic.js"

function Play() {
  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const [key, setKey] = useState(0);
  const { library, account } = useWeb3React();
  if (library === undefined) window.location.href = "/";
  const [contract, setContract] = useState(undefined);
  const [gameState, setGameState] = useState(0);
  const [colonies, setColonies] = useState(undefined);
  const [bottomRight, setBottomRight] = useState(dimensions.bottomRight);
  const [topLeft, setTopLeft] = useState(dimensions.topLeft);
  const [plot, setPlot] = useState(null);
  const [activePlots, setActivePlots] = useState(new Map());
  const inPlay = true;

  useEffect(() => {
    const { abi } = require("../../contracts/Eykar.json");
    const loadedContract = new Contract(
      "0x0758f958138D7Ba8b648bA31e37C2Ec19A7929d0", //"0x46C65e6C9662E176629c496bC4716a925182Ea06",
      abi,
      library.getSigner(account)
    );
    setContract(loadedContract);
    (async () => {
      setColonies(await loadedContract.getColonies(account));
    })();
    const onBlock = () =>
      (async () => {
        setColonies(await loadedContract.getColonies(account));
      })();

    library.on("block", onBlock);
    return () => {
      library.removeListener("block", onBlock);
    };
  }, [library, account]);

  useEffect(() => {
    if (gameState === 3) {
      console.log("looking for new plots");
      (async () => {
        const startX = Math.trunc(topLeft.x / 8);
        const startY = Math.trunc(topLeft.y / 8);
        const endX = Math.trunc(bottomRight.x / 8) + 1;
        const endY = Math.trunc(bottomRight.y / 8) + 1;
        console.log(startX, startY, endX, endY);
        for (let i = startX; i < endX; i++)
          for (let j = startY; j < endY; j++) {
            const output = await contract.getPlots(i, j);
            for (let k = 0; k < output.plots.length; k++)
              activePlots.set(szudzik(output.xArray[k], output.yArray[k]), output.plots[k]);
          }
          console.log("new activePlots", activePlots);

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

  const voronoi = {
    data: null,
    get getVoronoi() {
      return this.data;
    },
    /**
     * @param {Delaunay} newValue
     */
    set setVoronoi(newValue) {
      this.data = newValue;
    },
  };
  const [coordinatesPerId, setCoordinatesPerId] = useState(new Map());
  const [plotInfo, setPlotInfo] = useState({
    coord: { x: 0, y: 0 },
    biome: null,
    elevation: null,
    temperature: null,
  });

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
      if (plot !== null)
        component = <PlotBox plotInfo={plotInfo} plot={plot} />;
      break;
    default:
      break;
  }
  return (
    <div className="game screen">
      <div className="game interactive">
        <PlayHeader gameState={gameState} setGameState={setGameState} />
        <MapCanvas
          key={key}
          coordinatesPerId={coordinatesPerId}
          voronoi={voronoi}
          bottomRight={bottomRight}
          setBottomRight={setBottomRight}
          topLeft={topLeft}
          setTopLeft={setTopLeft}
          setPlotInfo={setPlotInfo}
          setPlot={setPlot}
          contract={contract}
          inPlay={inPlay}
          activePlots={activePlots}
        />
        {component}
      </div>
    </div>
  );
}
export default Play;
