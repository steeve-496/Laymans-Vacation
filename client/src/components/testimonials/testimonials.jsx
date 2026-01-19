import React, { useRef, useEffect } from 'react';
import "./testimonials.css";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "Bali, Indonesia",
    rating: 5,
    review: "The most magical trip of my life. Bali was a dream.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    // Top Left (High)
    pos: { top: "8%", left: "2%" }
  },
  {
    id: 2,
    name: "David Chen",
    location: "Kyoto, Japan",
    rating: 5,
    review: "Every hotel, every guide was perfect. Attention to detail was unmatched.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    // Top Right (High)
    pos: { top: "15%", right: "1%" }
  },
  {
    id: 3,
    name: "Emma Wilson",
    location: "Santorini, Greece",
    rating: 5,
    review: "I just showed up and enjoyed the sunsets. Layman took care of everything.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    pos: { bottom: "10%", right: "42%" }
  },
  {
    id: 4,
    name: "Michael Ross",
    location: "Cairo, Egypt",
    rating: 4,
    review: "An adventure I'll never forget. The desert safari was breathtaking.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    pos: { bottom: "12%", right: "2%" }
  },
  {
    id: 5,
    name: "Priya Patel",
    location: "Kerala, India",
    rating: 5,
    review: "Truly god's own country, experienced in the best way possible.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    // Middle Left (Spread out from center)
    pos: { top: "45%", left: "0%" }
  },
  {
    id: 6,
    name: "James Wilson",
    location: "Swiss Alps",
    rating: 5,
    review: "The skiing arrangements were top notch. seamless transfers.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    pos: { top: "5%", left: "40%" }
  }
];

function Testimonials() {
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            // Optional: Remove to trigger animation every time
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    const cards = containerRef.current.querySelectorAll('.sc-card-wrapper');
    const header = containerRef.current.querySelector('.sc-header');

    if (header) observer.observe(header);
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`sc-testimonials-section ${isExpanded ? 'expanded' : 'collapsed'}`}
      id="testimonials"
      ref={containerRef}
    >
      <div className="sc-testimonials-content">
        <div className="sc-header">
          <h2 className="sc-title">TESTIMONIALS</h2>
          <p className="sc-subtitle">All our happy clients</p>
        </div>

        <div className="sc-testimonials-cloud">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className={`sc-card-wrapper sc-pos-${i}`}
              style={{
                top: t.pos.top,
                left: t.pos.left,
                right: t.pos.right,
                bottom: t.pos.bottom
              }}
            >
              <div className="sc-card">
                <div className="sc-card-header">
                  <img src={t.image} alt={t.name} className="sc-avatar" />
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
      </div>

      {/* Mobile Toggle Button */}
      <div className="sc-mobile-toggle">
        {!isExpanded && (
          <div className="sc-gradient-overlay">
            <button
              className="sc-see-more-btn"
              onClick={() => setIsExpanded(true)}
            >
              See More Testimonials
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials;  