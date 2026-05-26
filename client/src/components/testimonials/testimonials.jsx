import React, { useRef, useEffect } from 'react';
import "./testimonials.css";

const getAvatarColor = (name) => {
  const colors = [
    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
    "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
    "#f1c40f", "#e67e22", "#e74c3c", "#f39c12", "#d35400", "#c0392b"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const ALL_REVIEWS = [
  {
    id: 1,
    name: "Abhijith Nair",
    location: "Kochi (Travelled to Bali)",
    rating: 5,
    review: "Booked our family trip to Bali through them. Absolutely outstanding! From handpicked boutique resorts to expert local guides who treated us like family, everything was planned to perfection. Sanal M. Issac and the team provided 24/7 support throughout. Highly recommend!",
    image: null
  },
  {
    id: 2,
    name: "Meera Krishnan",
    location: "Ernakulam (Travelled to Kyoto)",
    rating: 5,
    review: "Unmatched attention to detail! I recently completed my second journey with them to Japan. They act like a personal travel concierge. Every hotel transfer, guided tour, and dining recommendation was absolutely flawless.",
    image: null
  },
  {
    id: 3,
    name: "Dr. Rahul Sen",
    location: "Kolkata (Travelled to Kashmir)",
    rating: 5,
    review: "Just amazing! We did the Kashmir package last month. The houseboats, scenic valley tours, and local stays were top-notch. They took care of everything from flights to ground transport, letting us relax and enjoy.",
    image: null
  },
  {
    id: 4,
    name: "Anjali Menon",
    location: "Kochi (Travelled to Santorini)",
    rating: 5,
    review: "Had the most magical honeymoon in Santorini! Layman's curated a perfect itinerary with private viewings and hidden gems we wouldn't have found on our own. The 24/7 on-ground concierge support gave us complete peace of mind.",
    image: null
  },
  {
    id: 5,
    name: "Thomas George",
    location: "Kottayam (Travelled to Swiss Alps)",
    rating: 5,
    review: "Outstanding skiing trip arranged in the Swiss Alps. The logistics, transfers, and accommodations were seamless. Proactive team that handles everything with extreme care and dedication. Best customized tour operators in Kochi!",
    image: null
  },
  {
    id: 6,
    name: "Saritha Pillai",
    location: "Thrippunithura (Travelled to Kerala)",
    rating: 5,
    review: "We had a wonderful houseboat and resort experience in Kerala. The itinerary matched our pace beautifully and the guides were excellent. Proactive team that handles everything with extreme care and dedication. Best travel operators!",
    image: null
  },
  {
    id: 7,
    name: "Vikram Malhotra",
    location: "Delhi (Travelled to Cairo)",
    rating: 5,
    review: "Truly professional! We toured Egypt with them. The desert safaris, pyramid tours, and cruises were perfectly coordinated. Every guide was highly knowledgeable and friendly. Best travel planning experience ever!",
    image: null
  },
  {
    id: 8,
    name: "Dr. Sandeep Kurup",
    location: "Kochi (Travelled to Thailand)",
    rating: 5,
    review: "Fantastic trip to Phuket and Krabi! Seamless airport transfers, great hotel bookings, and beautiful boat tours. Sanal and the team are super responsive and made sure everything went perfectly. A solid five-star service!",
    image: null
  },
  {
    id: 9,
    name: "Kavitha Pillai",
    location: "Kochi (Travelled to Maldives)",
    rating: 5,
    review: "An unforgettable experience in the Maldives! Layman's Vacation got us a premium water villa package at a great rate. Everything from the seaplane transfer to resort check-in was seamless.",
    image: null
  },
  {
    id: 10,
    name: "Rohan Mathew",
    location: "Ernakulam (Travelled to Vietnam)",
    rating: 4,
    review: "We had an amazing customized tour of Vietnam. Visited Hanoi, Halong Bay, and Hoi An. The hotels recommended were lovely and the local guides were super knowledgeable. Highly responsive and helpful service!",
    image: null
  }
];

function Testimonials() {
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [shuffledTestimonials, setShuffledTestimonials] = React.useState(() => {
    // Initial render displays first 6 reviews pre-assigned
    return ALL_REVIEWS.slice(0, 6);
  });

  useEffect(() => {
    // 1. Separate 5-star and 4-star reviews to prioritize 5-star
    const fiveStars = ALL_REVIEWS.filter(r => r.rating === 5);
    const threeOrFourStars = ALL_REVIEWS.filter(r => r.rating >= 3 && r.rating < 5);

    // 2. Shuffle both pools
    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const shuffledFive = shuffleArray(fiveStars);
    const shuffledOthers = shuffleArray(threeOrFourStars);

    // 3. Combine them with 5-star reviews first (high priority), followed by 4-star reviews
    const combined = [...shuffledFive, ...shuffledOthers];
    setShuffledTestimonials(combined);
  }, []);

  // Limit to 3 reviews if collapsed, show all if expanded on all devices
  const displayedReviews = isExpanded ? shuffledTestimonials : shuffledTestimonials.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.05 }
    );

    const cards = containerRef.current.querySelectorAll('.sc-card-wrapper');
    const header = containerRef.current.querySelector('.sc-header');

    if (header) observer.observe(header);
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [displayedReviews]);

  return (
    <section
      className="sc-testimonials-section"
      id="testimonials"
      ref={containerRef}
    >
      <div className="sc-testimonials-content">
        <div className="sc-header">
          <h2 className="sc-title">TESTIMONIALS</h2>
          <p className="sc-subtitle">All our happy clients</p>
        </div>

        <div className="sc-testimonials-grid">
          {displayedReviews.map((t) => (
            <div
              key={t.id}
              className="sc-card-wrapper"
            >
              <div className="sc-card">
                <div className="sc-card-header">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="sc-avatar" />
                  ) : (
                    <div 
                      className="sc-avatar-initials" 
                      style={{ backgroundColor: getAvatarColor(t.name) }}
                    >
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div className="sc-info">
                    <h4>{t.name}</h4>
                    <span>{t.location}</span>
                  </div>
                </div>
                <div className="sc-rating">
                  {[...Array(t.rating)].map((_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
                <p className="sc-review">"{t.review}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Button for All Screens */}
        {shuffledTestimonials.length > 3 && (
          <div className="sc-toggle-container">
            {!isExpanded ? (
              <div className="sc-gradient-overlay">
                <button
                  className="sc-see-more-btn"
                  onClick={() => setIsExpanded(true)}
                >
                  See More Testimonials
                </button>
              </div>
            ) : (
              <div className="sc-collapse-container">
                <button
                  className="sc-see-more-btn"
                  onClick={() => setIsExpanded(false)}
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials;