import "./hero.css";

function Hero() {
  return (
    <section className="hero_section">
      <div className="bg_image">
        <img src="/background.png" alt="bg_image" />
      </div>

      <div className="hero_content">
        <h1 className="hero_title">The Layman’s Vacation</h1>
        <p className="hero_subtitle">Every Journey is a Story. Start Your Next Chapter.</p>
        <button className="hero_btn">Explore<div class="icon"><svg
                  height="24"
                  width="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                    fill="currentColor"
                  ></path>
                </svg>
                </div>
          </button>
      </div>
    </section>
  );
}

export default Hero;
