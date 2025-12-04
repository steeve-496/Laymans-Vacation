import React, { forwardRef } from "react";
import "./packages.css";
import { optimizeCloudinaryUrl } from "../../utils/imageOptimizer";

const Packages = forwardRef(({ location }, ref) => {
    const packages = [
        {
            id: 1,
            title: `Best of ${location}`,
            price: "Rs 25,000",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
        },
        {
            id: 2,
            title: `${location} Adventure`,
            price: "Rs 1,00,000",
            image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop",
        },
        {
            id: 3,
            title: `Luxury ${location}`,
            price: "Rs 2,50,000",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
        },
    ];

    return (
        <section className="packages-section" ref={ref}>
            <div className="packages-container">
                <div className="packages-grid">
                    {packages.map((pkg) => (
                        <div className="package-card" key={pkg.id}>
                            <div className="package-image-container">
                                <img
                                    src={optimizeCloudinaryUrl(pkg.image, 400)}
                                    alt={pkg.title}
                                    className="package-image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="package-info">
                                <h3 className="package-title">{pkg.title}</h3>
                                <div className="package-details">
                                    <p className="package-price">{pkg.price}</p>
                                    <button className="book-btn">Book Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

export default Packages;
