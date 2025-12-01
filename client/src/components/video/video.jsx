import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import "./video.css";

gsap.registerPlugin(ScrollTrigger);

export default function Video() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);

  const videos = [
    "/videos/azerbaijan.mp4",
    "/videos/bali.mp4",
    "/videos/bhutan.mp4",
    "/videos/kerala.mp4",
    "/videos/dubai.mp4",
    "/videos/bhutan.mp4",
    "/videos/kazaksthan.mp4",
    "/videos/malaysia.mp4",
    "/videos/singapore.mp4",
    "/videos/srilanka.mp4",
    "/videos/thailand.mp4",
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
          end: "+=250%",
          pin: true,
          scrub: 1,
        },
      });

      // Initial state
      tl.set(colRefs.map((r) => r.current), {
        scale: 0,
        opacity: 1,
        xPercent: 0,
      })
        .to(
          heroRef.current,
          {
            scale: 0.2,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "start"
        )
        .to(
          colRefs.map((r) => r.current),
          {
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
          },
          "start"
        )
        .to(
          col1Ref.current,
          {
            xPercent: -10,
            duration: 1,
            ease: "power2.out",
          },
          "start+=0.2"
        )
        .to(
          col3Ref.current,
          {
            xPercent: 10,
            duration: 1,
            ease: "power2.out",
          },
          "start+=0.2"
        );
    },
    { scope: containerRef }
  );

  return (
    <div className="video-page-container" ref={containerRef}>
      <div className="hero-video-section" ref={heroRef}>
        <video src={videos[3]} muted loop autoPlay playsInline />
      </div>

      <div className="videos" ref={gridRef}>
        {columns.map((columnVideos, index) => (
          <div
            className={`column ${index === 1 ? "reverse" : ""}`}
            key={index}
            ref={colRefs[index]}
          >
            <div className="cards">
              {columnVideos.map((src, i) => (
                <div className="card" key={i}>
                  <video src={src} muted loop autoPlay playsInline />
                </div>
              ))}
              {columnVideos.map((src, i) => (
                <div className="card" key={`dup-${i}`}>
                  <video src={src} muted loop autoPlay playsInline />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}