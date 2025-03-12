import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "../src/pages/HomePage";
import AccModal from "../src/components/AccModal";

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
          }
        />
      </Routes>
      <AccModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </BrowserRouter>
  );
}
