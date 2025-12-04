import React, { useState, useRef } from "react";
import "./App.css";
import Header from "./components/header/header";
import Hero from "./components/hero/hero";
import VideoSection from "./components/video/video";
import Destinations from "./components/destinations/destinations";
import StateExplorer from "./components/state-explorer/state-explorer";
import Packages from "./components/packages/packages";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [selectedCountry, setSelectedCountry] = useState("Azerbaijan");
  const [selectedPackageLocation, setSelectedPackageLocation] = useState(null);
  const stateExplorerRef = useRef(null);
  const packagesRef = useRef(null);

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    // Scroll to State Explorer
    stateExplorerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExplore = (locationName) => {
    setSelectedPackageLocation(locationName);
    // Wait for render then scroll
    setTimeout(() => {
      packagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="app-container">
      <Header />
      <Hero />
      <VideoSection />
      <Destinations onCountrySelect={handleCountrySelect} />
      <StateExplorer
        ref={stateExplorerRef}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        onExplore={handleExplore}
      />
      {selectedPackageLocation && (
        <Packages ref={packagesRef} location={selectedPackageLocation} />
      )}
    </div>
  );
}

export default App;
