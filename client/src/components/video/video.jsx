import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import "./video.css";

gsap.registerPlugin(ScrollTrigger);

const optimizeUrl = (url) => {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
};

const LazyVideo = ({ src, ...props }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div ref={videoRef} className="video-placeholder" style={{ width: '100%', height: '100%' }}>
      {isVisible && (
        <video
          src={optimizeUrl(src)}
          {...props}
        />
      )}
    </div>
  );
};

export default function Video() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const mainCardRef = useRef(null);

  const videos = [
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571911/azerbaijan_auzxnj.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571875/bali_cfkchr.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571885/bhutan_x3nljx.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571844/dubai_tbxlb4.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571863/kazaksthan_jaj7ej.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571838/veitnam_pq4qqf.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571876/malaysia_bf3wum.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571882/kerala_ncc2jr.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571867/singapore_v98wpc.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571888/srilanka_nmvfom.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571914/thailand_avuka1.mp4",
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
        }, "<+0.2");

    },
    { scope: containerRef }
  );

  return (
    <div className="video-page-container" ref={containerRef}>
      <div className="videos" ref={gridRef}>
        {columns.map((columnVideos, index) => (
          <div
            className={`column ${index === 1 ? "reverse" : ""}`}
            key={index}
            ref={colRefs[index]}
          >
            <div className="cards">
              {columnVideos.map((src, i) => {
                // User specified index 2 for main card in middle column
                const isMainCard = index === 1 && i === 2;

                return (
                  <div
                    className="card"
                    key={i}
                    ref={isMainCard ? mainCardRef : null}
                    style={isMainCard ? { zIndex: 10 } : {}}
                  >
                    <LazyVideo src={src} muted loop autoPlay playsInline />
                  </div>
                );
              })}
              {/* Duplicates for infinite scroll */}
              {columnVideos.map((src, i) => (
                <div className="card" key={`dup-${i}`}>
                  <LazyVideo src={src} muted loop autoPlay playsInline />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}