import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // fade + slide content
      gsap.fromTo(
        ".hero_content",
        { opacity: 1, y: 0, zIndex: 1 },
        {
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "70% top",
            markers: 1,
            scrub: true,
          },
        }
      );

      // parallax float of background image
      gsap.fromTo(
        ".bg_image",
        { y: 0, zIndex: 0 },
        {
          zIndex: 9999,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".hero_section",
            start: "top top",
            end: "bottom top",
            pin: ".hero_content",
            scrub: true,
          },
        }
      );

      // hero to video cinematic transition
      gsap.fromTo(
        ".bg_image",
        { scale: 1, y: 0, opacity: 1 },
        {
          scale: 2.5,
          opacity: 0,
          y: 0,

          ease: "power3.out",
          scrollTrigger: {
            trigger: ".videos", // Video component wrapper
            start: "top bottom",
            end: "bottom center",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero_section" ref={heroRef}>
      <div className="bg_image">
        <img src="/background(1).png" alt="bg_image" />
      </div>

      <div className="hero_content">
        <h1 className="hero_title">The Layman’s Vacation</h1>
        <p className="hero_subtitle">
          Every Journey is a Story. Start Your Next Chapter.
        </p>

        <button className="hero_btn">
          Explore
          <div className="icon">
            <svg height="24" width="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                fill="currentColor"
              />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
}

export default Hero;
