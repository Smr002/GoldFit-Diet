import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import OurVision from "../components/OurVision";
import Workouts from "../components/LandingWorkouts";
import Prices from "../components/Prices";
import ThemeToggle from "../components/ThemeToggle";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

function HomePage({ setModalOpen, isModalOpen }) {
    return (
      <>
        <Navbar setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
        <ThemeToggle />
        <Landing setModalOpen={setModalOpen} isModalOpen={isModalOpen}/>
        <OurVision />
        <Workouts setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
        <Prices setModalOpen={setModalOpen} isModalOpen={isModalOpen}/>
        <ContactUs />
        <Footer />
  
      </>
    );
}

export default HomePage;
