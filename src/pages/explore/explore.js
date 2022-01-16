import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map";

function Explore() {
  return (
    <>
      <Header />
      <MapCanvas setClickedPlotCallback={() => { }} />
    </>
  );
}
export default Explore;
