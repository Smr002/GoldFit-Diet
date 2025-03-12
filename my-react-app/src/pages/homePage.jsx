import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import OurVision from "../components/OurVision";
import Workouts from "../components/Workouts";
import Prices from "../components/Prices";


function HomePage({ setModalOpen, isModalOpen }) {
    return (
      <>
        <Navbar setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
        <Landing />
        <OurVision/>
        <Workouts/>
        <Prices/>
      </>
    );
  }

export default HomePage;
