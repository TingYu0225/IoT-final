import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./containers/home";
import PalletInfo from "./containers/palletInfo";
import PalletMap from "./containers/find/palletMap";
import SelectType from "./containers/find/selectType";
import Login from "./containers/login";
import { IoTProvider } from "./hooks/useIoT";
import ShowPos from "./containers/showPos";
import SelectContent from "./containers/find/selectContent";
function App() {
  return (
    <BrowserRouter>
      <IoTProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/selectType" element={<SelectType />} />
          <Route path="/palletMap" element={<PalletMap />} />
          <Route path="/showPos" element={<ShowPos />} />
          <Route path="/palletInfo" element={<PalletInfo />} />
          <Route path="/selectContent" element={<SelectContent />} />
        </Routes>
      </IoTProvider>
    </BrowserRouter>
  );
}

export default App;
