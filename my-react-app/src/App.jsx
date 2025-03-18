import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "../src/pages/HomePage";
import AccModal from "../src/components/AccModal";
import CreateAccount from "./pages/CreateAccount";

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
        <Route path="/create-account/*" element={<CreateAccount />} />
      </Routes>
      <AccModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </BrowserRouter>
  );
}
