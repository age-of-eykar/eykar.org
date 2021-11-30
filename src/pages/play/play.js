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

function Play() {
  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const [key, setKey] = useState(0);
  const { library, account } = useWeb3React();
  if (library === undefined) window.location.href = "/";
  const [contract, setContract] = useState(undefined);
  const [gameState, setGameState] = useState(0);
  const [colonies, setColonies] = useState([]);
  const [bottomRight, setBottomRight] = useState(dimensions.bottomRight);
  const [topLeft, setTopLeft] = useState(dimensions.topLeft);
  const [plot, setPlot] = useState(null);
  const inPlay = true;

  useEffect(() => {
    const { abi } = require("../../contracts/Eykar.json");
    const loadedContract = new Contract(
      "0x4E83C1eA2B08D88Abe6e3C15AEE01c3AD7FB7d2E", //"0x46C65e6C9662E176629c496bC4716a925182Ea06",
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
    if (colonies.length === 0) setGameState(1);
    else setGameState(2);
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
  const [plot, setPlot] = useState(null);

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
      component = (
        <PlotBox
          plotInfo={plotInfo}
          plot={plot}
        />
      );
      break;
  }
  return (
    <div className="">
      <PlayHeader />
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
      />
      {component}
    </div>
  );
}
export default Play;
