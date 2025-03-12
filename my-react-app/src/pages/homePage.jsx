import Navbar from "@/components/Navbar";
import Landing from "@/components/Landing";


function HomePage({ setModalOpen, isModalOpen }) {
    return (
      <>
        <Navbar setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
        <Landing />
      </>
    );
  }

export default HomePage;
