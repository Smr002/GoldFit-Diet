import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import OurVision from "../components/OurVision";
import Workouts from "../components/Workouts";
import Prices from "../components/Prices";
import ThemeToggle from "../components/ThemeToggle";


function HomePage({ setModalOpen, isModalOpen }) {
    return (
      <>
        <Navbar setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
        <ThemeToggle/>
        <Landing />
        <OurVision/>
        <Workouts/>
        <Prices/>
      </>
    );
  }

export default HomePage;
