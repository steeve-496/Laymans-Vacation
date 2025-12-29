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

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
        },
      });

      // Initial state
      tl.set(mainCardRef.current, {
        scale: 4, // Increased scale
        zIndex: 100,
        transformOrigin: "center center",
      })
        .set(col1Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: -100, // Start diverged left
        })
        .set(col3Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: 100, // Start diverged right
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
          xPercent: 0, // Converge to center
          duration: 1.1,
          ease: "power2.out",
        }, "<+0.2")
        // Exit animation (Shrink and Fade out at the end of scroll)
        .to(gridRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }, ">+0.5"); // Start after convergence is done

    },
    { scope: containerRef }
  );

  return (
    <div className="video-page-container" ref={containerRef}>
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