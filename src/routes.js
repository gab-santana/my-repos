import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main"
import Repositories from "./pages/Repositories"
export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/repositories/:repositorie" element={<Repositories />} />
      </Routes>
    </BrowserRouter>
  )
}
