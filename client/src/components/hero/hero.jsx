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
      // Image overlaps title animation
      // Instead of fading content, we make the image cover it
      gsap.to(".bg_image", {
        zIndex: 10, // Move image in front of content
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top", // As soon as scroll starts
          end: "10% top",
          toggleActions: "play none none reverse",
        }
      });

      // parallax scale of background image
      gsap.fromTo(
        ".bg_image img",
        {
          scale: 1,
          y: 0
        },
        {
          y: -200,
          scale: 2, // Scale up
          ease: "none", // Linear scale with scroll
          scrollTrigger: {
            trigger: ".hero_section",
            start: "top top",
            end: "bottom top",
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
        <img
          src="https://res.cloudinary.com/divwmzd8g/image/upload/v1764576553/background4k_ruaeim.webp"
          alt="bg_image"
          fetchpriority="high"
        />
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
