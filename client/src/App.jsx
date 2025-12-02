import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header/header.jsx";
import Hero from "./components/hero/hero.jsx";
import Video from "./components/video/video.jsx";
import Destinations from "./components/destinations/destinations.jsx";
import Admin from "./components/admin/admin.jsx";
import StateExplorer from "./components/state-explorer/state-explorer";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef();
  const explorerRef = useRef(null);
  const [currentCountry, setCurrentCountry] = useState("Azerbaijan");

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenisRef.current = lenis;

    // Connect GSAP ScrollTrigger to Lenis
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <Video />
              <Destinations onCountrySelect={(country) => {
                setCurrentCountry(country);
                // Scroll to StateExplorer
                if (explorerRef.current) {
                  lenisRef.current?.scrollTo(explorerRef.current, { offset: 0, duration: 1.5 });
                }
              }} />
              <StateExplorer
                ref={explorerRef}
                selectedCountry={currentCountry}
                onCountryChange={setCurrentCountry}
              />
            </>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router >
  );
}
