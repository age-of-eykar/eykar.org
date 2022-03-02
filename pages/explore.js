import Header from "../components/header";
import MapCanvas from "../components/map/canvas";

function Explore() {
  return (
    <>
      <Header />
      <MapCanvas setClickedPlotCallback={() => { }} />
    </>
  );
}
export default Explore;
