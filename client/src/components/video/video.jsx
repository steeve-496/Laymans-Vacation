import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import "./video.css";

gsap.registerPlugin(ScrollTrigger);


const optimizeUrl = (url) => {
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_720/");
  }
  return url;
};

const LazyVideo = ({ src, eager = false, appLoaded, ...props }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!appLoaded) return;
    setIsVisible(true);
  }, [appLoaded]);

  return (
    <div ref={videoRef} className="video-placeholder" style={{ width: '100%', height: '100%' }}>
      {isVisible && (
        <video
          src={optimizeUrl(src)}
          {...props}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
};

export default function Video({ appLoaded }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const mainCardRef = useRef(null);

  const videos = [
    "/videos/azerbaijan.mp4",
    "/videos/bali.mp4",
    "/videos/bhutan.mp4",
    "/videos/dubai.mp4",
    "/videos/kazaksthan.mp4",
    "/videos/malaysia.mp4",
    "/videos/singapore.mp4",
    "/videos/kerala.mp4",
    "/videos/srilanka.mp4",
    "/videos/thailand.mp4",
    "/videos/veitnam.mp4",
  ];

  const col1 = videos.filter((_, i) => i % 3 === 0);
  const col2 = videos.filter((_, i) => i % 3 === 1);
  const col3 = videos.filter((_, i) => i % 3 === 2);

  const columns = [col1, col2, col3];
  const colRefs = [col1Ref, col2Ref, col3Ref];

  /* ================== DYNAMIC TEXT LOGIC ================== */
  const phrases = [
    "Explore The Unseen",
    "Live The Journey",
    "Capture The Moment"
  ];

  const [activePhrase, setActivePhrase] = useState(0);

  useGSAP(
    () => {
      // Helper to update phrase
      const updatePhrase = (self) => {
        const progress = self.progress;
        const index = Math.floor(progress * phrases.length);
        const validIndex = Math.min(index, phrases.length - 1);
        setActivePhrase(validIndex);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          onUpdate: updatePhrase
        },
      });

      // Mobile Text Fade In/Out
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        onEnter: () => gsap.to(".video-scroll-text h2", { opacity: 1, duration: 0.5 }),
        onLeave: () => gsap.to(".video-scroll-text h2", { opacity: 0, duration: 0.5 }),
        onEnterBack: () => gsap.to(".video-scroll-text h2", { opacity: 1, duration: 0.5 }),
        onLeaveBack: () => gsap.to(".video-scroll-text h2", { opacity: 0, duration: 0.5 })
      });

      // Check if mobile
      const isMobile = window.innerWidth <= 768;

      // Initial state
      tl.set(mainCardRef.current, {
        scale: isMobile ? 7 : 4, // 7 for Mobile (Zoomed), 4 for Desktop (Original)
        zIndex: 100,
        transformOrigin: "center center",
      })
        .set(col1Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: -100,
        })
        .set(col3Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: 100,
        });

      // Animation
      tl.to(mainCardRef.current, {
        scale: 1,
        duration: 1,
        ease: "power2.inOut",
      })
        .to([col1Ref.current, col3Ref.current], {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          duration: 1.1,
          ease: "power2.out",
        }, "<+0.2")
        // Exit animation
        .to(gridRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }, ">+0.5");

    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div className="video-page-container" ref={containerRef}>
      {/* Dynamic Text Overlay - Fixed Center */}
      <div className="video-scroll-text">
        <h2>{phrases[activePhrase]}</h2>
      </div>

      <div className="video-grid" ref={gridRef}>
        {columns.map((columnVideos, index) => (
          <div
            className={`video-column ${index === 1 ? "video-reverse" : ""}`}
            key={index}
            ref={colRefs[index]}
          >
            <div className="video-cards">
              {columnVideos.map((src, i) => {
                // User specified index 2 for main card in middle column
                const isMainCard = index === 1 && i === 2;

                return (
                  <div
                    className="video-card"
                    key={i}
                    ref={isMainCard ? mainCardRef : null}
                    style={isMainCard ? { zIndex: 10 } : {}}
                  >
                    <LazyVideo src={src} eager={isMainCard} appLoaded={appLoaded} muted loop autoPlay playsInline />
                  </div>
                );
              })}
              {/* Duplicates for infinite scroll */}
              {columnVideos.map((src, i) => (
                <div className="video-card" key={`dup-${i}`}>
                  <LazyVideo src={src} appLoaded={appLoaded} muted loop autoPlay playsInline />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}